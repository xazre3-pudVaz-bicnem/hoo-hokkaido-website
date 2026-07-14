import { NextResponse } from "next/server";
import { isValidEmail, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  agree?: boolean;
  /** ハニーポット */
  website?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("お名前を入力してください。");
  if (!body.email?.trim() || !isValidEmail(body.email)) {
    errors.push("メールアドレスを正しく入力してください。");
  }
  if (!body.message?.trim()) errors.push("お問い合わせ内容を入力してください。");
  if (!body.agree) errors.push("プライバシーポリシーへの同意が必要です。");

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, message: errors.join("\n") },
      { status: 400 }
    );
  }

  const text = [
    "Webサイトから新しいお問い合わせが届きました。",
    "",
    `■ お名前: ${body.name}`,
    `■ メール: ${body.email}`,
    `■ 電話番号: ${body.phone || "未記入"}`,
    `■ 件名: ${body.subject || "（なし）"}`,
    "",
    "■ お問い合わせ内容:",
    body.message,
  ].join("\n");

  const result = await sendMail({
    subject: `【お問い合わせ】${body.name}様`,
    text,
    replyTo: body.email,
  });

  if (!result.ok) {
    const message =
      result.reason === "not-configured" && process.env.NODE_ENV !== "production"
        ? "メール送信が設定されていません（RESEND_API_KEY 未設定）。.env.local を確認してください。"
        : "送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、お電話にてご連絡ください。";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

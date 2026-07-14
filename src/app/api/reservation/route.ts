import { NextResponse } from "next/server";
import { activities } from "@/data/activities";
import { isValidEmail, isValidPhone, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

type ReservationBody = {
  lastName?: string;
  firstName?: string;
  furigana?: string;
  birthdate?: string;
  phone?: string;
  email?: string;
  activity?: string;
  preferredDate?: string;
  preferredTime?: string;
  participants?: string;
  ageComposition?: string;
  message?: string;
  agree?: boolean;
  /** ハニーポット（人間には見えない項目。値が入っていればスパム） */
  website?: string;
};

export async function POST(request: Request) {
  let body: ReservationBody;
  try {
    body = (await request.json()) as ReservationBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: "リクエストの形式が正しくありません。" },
      { status: 400 }
    );
  }

  // ハニーポット：botには成功したように見せる
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const errors: string[] = [];
  if (!body.lastName?.trim()) errors.push("姓を入力してください。");
  if (!body.firstName?.trim()) errors.push("名を入力してください。");
  if (!body.furigana?.trim()) errors.push("フリガナを入力してください。");
  if (!body.birthdate?.trim()) errors.push("生年月日を入力してください。");
  if (!body.phone?.trim() || !isValidPhone(body.phone)) {
    errors.push("電話番号を正しく入力してください。");
  }
  if (!body.email?.trim() || !isValidEmail(body.email)) {
    errors.push("メールアドレスを正しく入力してください。");
  }
  const activity = activities.find((a) => a.slug === body.activity);
  if (!activity) errors.push("希望アクティビティを選択してください。");
  if (!body.preferredDate?.trim()) errors.push("希望日を入力してください。");
  if (!body.participants?.trim()) errors.push("参加人数を入力してください。");
  if (!body.agree) errors.push("プライバシーポリシーへの同意が必要です。");

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, message: errors.join("\n") },
      { status: 400 }
    );
  }

  const text = [
    "Webサイトから新しい予約リクエストが届きました。",
    "（フォーム送信時点では予約確定ではありません）",
    "",
    `■ お名前: ${body.lastName} ${body.firstName}（${body.furigana}）`,
    `■ 生年月日: ${body.birthdate}`,
    `■ 電話番号: ${body.phone}`,
    `■ メール: ${body.email}`,
    `■ 希望アクティビティ: ${activity!.name}`,
    `■ 希望日: ${body.preferredDate}`,
    `■ 希望時間: ${body.preferredTime || "指定なし"}`,
    `■ 参加人数: ${body.participants}`,
    `■ 参加者の年齢構成: ${body.ageComposition || "未記入"}`,
    "",
    "■ 質問・相談事項:",
    body.message || "（なし）",
  ].join("\n");

  const result = await sendMail({
    subject: `【予約リクエスト】${activity!.name}（${body.lastName} ${body.firstName}様）`,
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

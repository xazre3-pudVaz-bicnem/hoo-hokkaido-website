import { NextResponse } from "next/server";
import { getDictionary } from "@/i18n/dictionary";
import { autoReply, localeNameJa } from "@/i18n/emails";
import { defaultLocale, isLocale, type Locale } from "@/i18n/locales";
import { adminRecipient, isValidEmail, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

type ContactBody = {
  locale?: string;
  name?: string;
  email?: string;
  phone?: string;
  contactLanguage?: string;
  subject?: string;
  message?: string;
  agree?: boolean;
  sourcePath?: string;
  /** ハニーポット */
  website?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    const dict = await getDictionary(defaultLocale);
    return NextResponse.json(
      { ok: false, message: dict.reservation.errors.badRequest },
      { status: 400 }
    );
  }

  const locale: Locale =
    body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = await getDictionary(locale);
  const e = dict.contact.errors;

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const errors: string[] = [];
  if (!body.name?.trim()) errors.push(e.name);
  if (!body.email?.trim() || !isValidEmail(body.email)) errors.push(e.email);
  if (!body.message?.trim()) errors.push(e.message);
  if (!body.agree) errors.push(e.agree);

  if (errors.length > 0) {
    return NextResponse.json(
      { ok: false, message: errors.join("\n") },
      { status: 400 }
    );
  }

  const contactLanguage: Locale =
    body.contactLanguage && isLocale(body.contactLanguage)
      ? body.contactLanguage
      : locale;

  const adminText = [
    "Webサイトから新しいお問い合わせが届きました。",
    "",
    `■ 閲覧言語：${localeNameJa[locale]}`,
    `■ 希望連絡言語：${localeNameJa[contactLanguage]}`,
    `■ 送信元ページ：${body.sourcePath || "（不明）"}`,
    "",
    `■ お名前：${body.name}`,
    `■ メール：${body.email}`,
    `■ 電話番号：${body.phone || "未記入"}`,
    `■ 件名：${body.subject || "（なし）"}`,
    "",
    "■ お問い合わせ内容：",
    body.message ?? "",
  ].join("\n");

  const subject = `【お問い合わせ／${localeNameJa[locale]}】${body.name}様`;

  const adminResult = await sendMail({
    subject,
    text: adminText,
    replyTo: body.email,
  });

  // 自動送信ができない場合は mailto 方式へ切り替える（本文は自動送信時と同一）
  if (!adminResult.ok) {
    return NextResponse.json({
      ok: false,
      code: "MAILTO_FALLBACK",
      mailto: { to: adminRecipient(), subject, body: adminText },
    });
  }

  const reply = autoReply[locale];
  await sendMail({
    to: body.email,
    subject: reply.contactSubject,
    text: reply.contactBody(body.name ?? ""),
  });

  return NextResponse.json({ ok: true });
}

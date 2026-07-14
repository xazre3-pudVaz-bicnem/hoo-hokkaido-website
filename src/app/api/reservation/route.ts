import { NextResponse } from "next/server";
import { activities } from "@/data/activities";
import { getDictionary } from "@/i18n/dictionary";
import { autoReply, localeNameJa } from "@/i18n/emails";
import { defaultLocale, isLocale, type Locale } from "@/i18n/locales";
import { formatPriceFull } from "@/lib/format";
import { isValidEmail, isValidPhone, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

type ReservationBody = {
  locale?: string;
  lastName?: string;
  firstName?: string;
  furigana?: string;
  birthdate?: string;
  country?: string;
  phone?: string;
  email?: string;
  contactLanguage?: string;
  stayArea?: string;
  activity?: string;
  preferredDate?: string;
  preferredTime?: string;
  participants?: string;
  ageComposition?: string;
  message?: string;
  agree?: boolean;
  sourcePath?: string;
  /** ハニーポット（人間には見えない項目。値が入っていればスパム） */
  website?: string;
};

export async function POST(request: Request) {
  let body: ReservationBody;
  try {
    body = (await request.json()) as ReservationBody;
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
  const e = dict.reservation.errors;

  // ハニーポット：botには成功したように見せる
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const errors: string[] = [];
  if (!body.lastName?.trim()) errors.push(e.lastName);
  if (!body.firstName?.trim()) errors.push(e.firstName);
  // フリガナは日本語ページのみ必須（外国語ページではローマ字表記は任意）
  if (locale === "ja" && !body.furigana?.trim()) errors.push(e.furigana);
  if (!body.birthdate?.trim()) errors.push(e.birthdate);
  if (!body.phone?.trim() || !isValidPhone(body.phone)) errors.push(e.phone);
  if (!body.email?.trim() || !isValidEmail(body.email)) errors.push(e.email);

  const activity = activities.find((a) => a.slug === body.activity);
  if (!activity) errors.push(e.activity);
  if (!body.preferredDate?.trim()) errors.push(e.preferredDate);
  if (!body.participants?.trim()) errors.push(e.participants);
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

  // 管理者宛メールは日本語で内容を確認できる形式
  const jaDict = await getDictionary("ja");
  const activityNameJa =
    jaDict.activities[activity!.slug as keyof typeof jaDict.activities].name;
  const activityNameUser =
    dict.activities[activity!.slug as keyof typeof dict.activities].name;
  const fullName = `${body.lastName} ${body.firstName}`;

  const adminText = [
    "Webサイトから新しい予約リクエストが届きました。",
    "（フォーム送信時点では予約確定ではありません）",
    "",
    `■ 閲覧言語：${localeNameJa[locale]}`,
    `■ 希望連絡言語：${localeNameJa[contactLanguage]}`,
    `■ 送信元ページ：${body.sourcePath || "（不明）"}`,
    "",
    `■ お名前：${fullName}`,
    `■ フリガナ／ローマ字表記：${body.furigana || "（未記入）"}`,
    `■ 生年月日：${body.birthdate}`,
    `■ 国・地域：${body.country || "（未記入）"}`,
    `■ 電話番号：${body.phone}`,
    `■ メール：${body.email}`,
    `■ 宿泊エリア・滞在先：${body.stayArea || "（未記入）"}`,
    "",
    `■ 希望アクティビティ：${activityNameJa}`,
    `■ 料金（参考）：${formatPriceFull(activity!, "ja", jaDict)}`,
    `■ 希望日：${body.preferredDate}`,
    `■ 希望時間：${body.preferredTime || "指定なし"}`,
    `■ 参加人数：${body.participants}`,
    `■ 参加者の年齢構成：${body.ageComposition || "未記入"}`,
    "",
    "■ 質問・相談事項：",
    body.message || "（なし）",
  ].join("\n");

  const adminResult = await sendMail({
    subject: `【予約リクエスト／${localeNameJa[locale]}】${activityNameJa}（${fullName}様）`,
    text: adminText,
    replyTo: body.email,
  });

  if (!adminResult.ok) {
    const message =
      adminResult.reason === "not-configured" &&
      process.env.NODE_ENV !== "production"
        ? e.notConfigured
        : e.failed;
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }

  // ユーザーへの自動返信は、フォームを送信した言語で送る
  const reply = autoReply[locale];
  await sendMail({
    to: body.email,
    subject: reply.reservationSubject,
    text: reply.reservationBody(fullName, activityNameUser),
  });

  return NextResponse.json({ ok: true });
}

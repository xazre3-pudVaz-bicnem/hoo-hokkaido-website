import { Resend } from "resend";
import { site } from "@/data/site";

/**
 * メール送信ヘルパー（Resend）。
 * APIキーは環境変数 RESEND_API_KEY で管理します（.env.example 参照）。
 * キー未設定時は送信せずエラーを返し、開発環境ではその内容をコンソールに出力します。
 */

type SendMailArgs = {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendMailResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "send-failed" };

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMail({
  to,
  subject,
  text,
  replyTo,
}: SendMailArgs): Promise<SendMailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = to ?? process.env.MAIL_TO ?? site.email;
  const from =
    process.env.MAIL_FROM ?? `${site.shortName} Website <onboarding@resend.dev>`;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[mail] RESEND_API_KEY が設定されていません。.env.local に RESEND_API_KEY を設定してください。\n" +
          `送信予定だった内容:\nTo: ${recipient}\nSubject: ${subject}\n${text}`
      );
    } else {
      console.error("[mail] RESEND_API_KEY is not configured.");
    }
    return { ok: false, reason: "not-configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      subject,
      text,
      replyTo,
    });
    if (error) {
      console.error("[mail] 送信に失敗しました:", error);
      return { ok: false, reason: "send-failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mail] 送信中にエラーが発生しました:", err);
    return { ok: false, reason: "send-failed" };
  }
}

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** 国番号付き（+81 など）も受け付ける電話番号バリデーション */
export const isValidPhone = (value: string) =>
  /^\+?[0-9\-() .]{8,20}$/.test(value.trim());

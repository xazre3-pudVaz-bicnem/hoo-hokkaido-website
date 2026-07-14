import { Resend } from "resend";
import { site } from "@/data/site";

/**
 * メール送信。
 *
 * ■ 設定なしでも使えるようにしている
 * RESEND_API_KEY を設定すれば、フォームから自動でメールを送信します。
 * 未設定（または送信失敗）の場合は「送信できなかった」ことを呼び出し側へ返し、
 * 画面側は mailto:（訪問者のメールソフトを開く方式）へ切り替えます。
 * → サーバーの設定も外部サービスの契約もなしに、そのまま運用できます。
 *
 * ■ 重要
 * 送信できていないのに「送信完了」と表示してはいけません。
 * （届いていないのに成功と見せるのは、問い合わせを失うことと同じです）
 */

export type MailFailReason = "not-configured" | "send-failed";

export type SendMailResult =
  | { ok: true }
  | { ok: false; reason: MailFailReason };

type SendMailArgs = {
  to?: string;
  subject: string;
  text: string;
  replyTo?: string;
};

/** 管理者宛メールの宛先（環境変数で差し替え可能） */
export function adminRecipient(): string {
  return process.env.MAIL_TO ?? site.email;
}

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
  const recipient = to ?? adminRecipient();
  const from =
    process.env.MAIL_FROM ?? `${site.shortName} Website <onboarding@resend.dev>`;

  if (!apiKey) {
    // 未設定は異常ではない（mailto方式で運用できる）ため、開発時のみ案内を出す
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[mail] RESEND_API_KEY が未設定のため、フォームは mailto 方式で動作します。" +
          "自動送信を有効にするには .env.local に RESEND_API_KEY を設定してください。"
      );
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

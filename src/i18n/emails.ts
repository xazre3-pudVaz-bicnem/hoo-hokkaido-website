import "server-only";
import type { Locale } from "./locales";
import { site } from "@/data/site";

/**
 * メール本文の多言語テンプレート。
 *
 * - 管理者宛メールは常に日本語（閲覧言語・希望連絡言語を明記）
 * - ユーザーへの自動返信は、フォームを送信した言語で送る
 *
 * 文言を変更する場合はこのファイルを編集してください。
 */

type ReplyTemplate = {
  reservationSubject: string;
  reservationBody: (name: string, activity: string) => string;
  contactSubject: string;
  contactBody: (name: string) => string;
};

const signature = `${site.name} (HOO)
${site.tel.international}
${site.email}
${site.url}`;

export const autoReply: Record<Locale, ReplyTemplate> = {
  ja: {
    reservationSubject: "【HOO】予約リクエストを受け付けました",
    reservationBody: (name, activity) => `${name} 様

この度は Hokkaido Outdoor Organization（HOO）へ予約リクエストをお送りいただき、ありがとうございます。
以下の内容で受け付けいたしました。

■ ご希望のアクティビティ：${activity}

※このメールの時点では予約は確定していません。
　内容を確認のうえ、担当者よりご連絡いたします。担当者からの返信をもって予約確定となります。

営業時間：9:00〜17:00（日本時間）

${signature}`,
    contactSubject: "【HOO】お問い合わせを受け付けました",
    contactBody: (name) => `${name} 様

この度は Hokkaido Outdoor Organization（HOO）へお問い合わせいただき、ありがとうございます。
内容を確認のうえ、担当者よりご連絡いたします。

営業時間：9:00〜17:00（日本時間）

${signature}`,
  },

  en: {
    reservationSubject: "[HOO] We have received your booking request",
    reservationBody: (name, activity) => `Dear ${name},

Thank you for sending a booking request to Hokkaido Outdoor Organization (HOO).
We have received your request for the following activity.

- Requested activity: ${activity}

Please note: this email does NOT confirm your booking.
Our staff will review your request and get back to you. Your booking is confirmed only once you receive a reply from our team.

Business hours: 9:00-17:00 (Japan Standard Time)

${signature}`,
    contactSubject: "[HOO] We have received your enquiry",
    contactBody: (name) => `Dear ${name},

Thank you for contacting Hokkaido Outdoor Organization (HOO).
We have received your message and our staff will get back to you shortly.

Business hours: 9:00-17:00 (Japan Standard Time)

${signature}`,
  },

  "zh-tw": {
    reservationSubject: "【HOO】已收到您的預約申請",
    reservationBody: (name, activity) => `${name} 您好，

感謝您向 Hokkaido Outdoor Organization（HOO）提出預約申請。
我們已收到以下內容：

・希望參加的活動：${activity}

※此封信件並不代表預約已完成。
　我們確認內容後會由專人與您聯繫，收到專人回覆後預約才算正式成立。

營業時間：9:00〜17:00（日本時間）

${signature}`,
    contactSubject: "【HOO】已收到您的來信",
    contactBody: (name) => `${name} 您好，

感謝您與 Hokkaido Outdoor Organization（HOO）聯繫。
我們已收到您的訊息，確認內容後將由專人回覆您。

營業時間：9:00〜17:00（日本時間）

${signature}`,
  },

  "zh-cn": {
    reservationSubject: "【HOO】已收到您的预约申请",
    reservationBody: (name, activity) => `${name} 您好：

感谢您向 Hokkaido Outdoor Organization（HOO）提交预约申请。
我们已收到以下内容：

・希望参加的活动：${activity}

※本邮件并不代表预约已确认。
　我们确认内容后会由专人与您联系，收到专人回复后预约才正式成立。

营业时间：9:00〜17:00（日本时间）

${signature}`,
    contactSubject: "【HOO】已收到您的咨询",
    contactBody: (name) => `${name} 您好：

感谢您联系 Hokkaido Outdoor Organization（HOO）。
我们已收到您的留言，确认内容后将由专人回复您。

营业时间：9:00〜17:00（日本时间）

${signature}`,
  },

  ko: {
    reservationSubject: "[HOO] 예약 신청을 접수했습니다",
    reservationBody: (name, activity) => `${name} 님, 안녕하세요.

Hokkaido Outdoor Organization(HOO)에 예약을 신청해 주셔서 감사합니다.
아래 내용으로 접수되었습니다.

· 희망 액티비티: ${activity}

※ 이 메일은 예약 확정을 의미하지 않습니다.
　내용 확인 후 담당자가 연락드리며, 담당자의 회신을 받으신 시점에 예약이 확정됩니다.

영업시간: 9:00~17:00 (일본 시간)

${signature}`,
    contactSubject: "[HOO] 문의를 접수했습니다",
    contactBody: (name) => `${name} 님, 안녕하세요.

Hokkaido Outdoor Organization(HOO)에 문의해 주셔서 감사합니다.
내용을 확인한 후 담당자가 연락드리겠습니다.

영업시간: 9:00~17:00 (일본 시간)

${signature}`,
  },
};

/** 管理者宛メールに書く「閲覧言語 / 希望連絡言語」の日本語ラベル */
export const localeNameJa: Record<Locale, string> = {
  ja: "日本語",
  en: "英語",
  "zh-tw": "繁体字中国語",
  "zh-cn": "簡体字中国語",
  ko: "韓国語",
};

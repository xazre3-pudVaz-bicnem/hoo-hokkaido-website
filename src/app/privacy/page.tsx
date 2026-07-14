import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description:
    "Hokkaido Outdoor Organization（HOO）のプライバシーポリシー。当サイトで取得する個人情報の利用目的、管理方法、第三者提供、お問い合わせ窓口について定めています。",
  path: "/privacy",
});

const sections = [
  {
    title: "1. 基本方針",
    body: [
      `${site.name}（以下「当団体」）は、当サイトの利用者からお預かりする個人情報の重要性を認識し、個人情報の保護に関する法令を遵守するとともに、適切な取得・利用・管理に努めます。`,
    ],
  },
  {
    title: "2. 取得する情報",
    body: [
      "当サイトでは、予約フォーム・お問い合わせフォームの送信時に、氏名、フリガナ、生年月日、電話番号、メールアドレス、参加希望日、参加人数、その他フォームにご入力いただいた情報を取得します。",
    ],
  },
  {
    title: "3. 利用目的",
    body: [
      "取得した個人情報は、以下の目的で利用します。",
      "・予約の確認・調整・確定のご連絡",
      "・お問い合わせへの回答",
      "・アクティビティ開催可否など、参加に関する重要なご連絡",
      "・サービスの品質向上のための参考情報",
    ],
  },
  {
    title: "4. 第三者提供",
    body: [
      "当団体は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。",
    ],
  },
  {
    title: "5. 個人情報の管理",
    body: [
      "取得した個人情報は、漏えい・滅失・毀損の防止に努め、適切に管理します。利用目的を達成した情報は、適切な方法で廃棄します。",
    ],
  },
  {
    title: "6. 外部サービスの利用",
    body: [
      "当サイトでは、フォームの送信処理やアクセス状況の把握のために外部サービスを利用する場合があります。外部サービスにおける情報の取り扱いは、各サービスのプライバシーポリシーに従います。",
    ],
  },
  {
    title: "7. 開示・訂正・削除の請求",
    body: [
      "ご本人からの個人情報の開示・訂正・削除のお申し出には、ご本人であることを確認のうえ、速やかに対応します。",
    ],
  },
  {
    title: "8. お問い合わせ窓口",
    body: [
      `個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。`,
      `${site.name}`,
      `所在地：${site.address.full}`,
      `電話：${site.tel.display}（${site.hours.display}）`,
      `メール：${site.email}`,
    ],
  },
  {
    title: "9. 改定",
    body: [
      "本ポリシーの内容は、法令の変更や運用の見直しに応じて、予告なく改定されることがあります。改定後の内容は当ページに掲載した時点で効力を生じます。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Privacy Policy" title="プライバシーポリシー" />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "プライバシーポリシー", path: "/privacy" },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl bg-white p-7 shadow-card md:p-10">
          {sections.map((section) => (
            <section key={section.title} className="mb-8 last:mb-0">
              <h2 className="text-base font-bold text-navy md:text-lg">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-2.5 text-sm leading-loose text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

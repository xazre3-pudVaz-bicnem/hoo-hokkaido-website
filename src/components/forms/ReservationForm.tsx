"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { sortedActivities } from "@/data/activities";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-forest-light bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/50 focus:border-water-deep focus:outline-none focus:ring-2 focus:ring-water-deep/30";
const labelClass = "mb-1.5 block text-sm font-bold text-navy";

function Required() {
  return (
    <span className="ml-1.5 rounded bg-water-deep px-1.5 py-0.5 text-[10px] font-bold text-white">
      必須
    </span>
  );
}

/**
 * 予約フォーム。
 * /reservation?activity=<slug> で希望アクティビティを初期選択できます。
 */
export default function ReservationForm({
  initialActivity,
}: {
  initialActivity?: string;
}) {
  const validInitial = sortedActivities.some((a) => a.slug === initialActivity)
    ? (initialActivity as string)
    : "";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // 二重送信防止

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      lastName: String(formData.get("lastName") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      furigana: String(formData.get("furigana") ?? ""),
      birthdate: String(formData.get("birthdate") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      activity: String(formData.get("activity") ?? ""),
      preferredDate: String(formData.get("preferredDate") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
      participants: String(formData.get("participants") ?? ""),
      ageComposition: String(formData.get("ageComposition") ?? ""),
      message: String(formData.get("message") ?? ""),
      agree: formData.get("agree") === "on",
      website: String(formData.get("website") ?? ""),
    };

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        setStatus("success");
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setErrorMessage(data.message ?? "送信に失敗しました。");
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "送信に失敗しました。通信環境をご確認のうえ、再度お試しください。"
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card md:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-forest" />
        <h2 className="mt-5 font-display text-2xl font-bold text-navy">
          送信が完了しました
        </h2>
        <p className="mt-4 text-sm leading-loose text-ink-soft">
          予約リクエストを受け付けました。
          <br />
          内容を確認のうえ、担当者からご連絡いたします。
          <br />
          <strong className="font-bold text-navy">
            担当者からの連絡をもって予約確定となります。
          </strong>
        </p>
        <p className="mt-6 text-xs text-ink-soft">
          しばらく経っても連絡がない場合は、お手数ですがお電話（090-5950-4006）にてご確認ください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="rounded-3xl bg-white p-6 shadow-card md:p-10">
      {/* ハニーポット（スパム対策・画面には表示されない） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Webサイト</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lastName" className={labelClass}>
            姓 <Required />
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            autoComplete="family-name"
            placeholder="山田"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="firstName" className={labelClass}>
            名 <Required />
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            autoComplete="given-name"
            placeholder="太郎"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="furigana" className={labelClass}>
          フリガナ <Required />
        </label>
        <input
          type="text"
          id="furigana"
          name="furigana"
          required
          placeholder="ヤマダ タロウ"
          className={inputClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="birthdate" className={labelClass}>
          生年月日 <Required />
        </label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          required
          autoComplete="bday"
          className={inputClass}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            電話番号 <Required />
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="09012345678"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            メールアドレス <Required />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="example@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="activity" className={labelClass}>
          希望アクティビティ <Required />
        </label>
        <select
          id="activity"
          name="activity"
          required
          defaultValue={validInitial}
          className={inputClass}
        >
          <option value="" disabled>
            選択してください
          </option>
          {sortedActivities.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}（{a.price.display}／{a.price.unit}）
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredDate" className={labelClass}>
            希望日 <Required />
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="preferredTime" className={labelClass}>
            希望時間
          </label>
          <input
            type="text"
            id="preferredTime"
            name="preferredTime"
            placeholder="例：午前中／13時頃"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="participants" className={labelClass}>
            参加人数 <Required />
          </label>
          <input
            type="text"
            id="participants"
            name="participants"
            required
            inputMode="numeric"
            placeholder="例：4名"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ageComposition" className={labelClass}>
            参加者の年齢構成
          </label>
          <input
            type="text"
            id="ageComposition"
            name="ageComposition"
            placeholder="例：大人2名・小学生2名"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          質問・相談事項
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="ご質問・ご相談があればご記入ください"
          className={inputClass}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-water-light/60 p-4 text-xs leading-relaxed text-ink">
        フォーム送信時点では予約確定ではありません。内容確認後、担当者からの連絡をもって予約確定となります。
      </div>

      <div className="mt-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="agree"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-forest"
          />
          <span>
            <Link
              href="/privacy"
              target="_blank"
              className="font-bold text-water-deep underline underline-offset-2 hover:text-navy"
            >
              プライバシーポリシー
            </Link>
            に同意する <Required />
          </span>
        </label>
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="whitespace-pre-line">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-water-deep px-8 text-base font-bold text-white shadow-card transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            送信中…
          </>
        ) : (
          "予約リクエストを送信する"
        )}
      </button>
    </form>
  );
}

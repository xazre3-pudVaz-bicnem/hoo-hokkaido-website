"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { localeConfig, locales, type Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Status = "idle" | "submitting" | "success" | "error";

export type ReservationFormStrings = {
  fields: Record<string, string>;
  notice: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  successStrong: string;
  successNote: string;
  required: string;
  errorNetwork: string;
};

export type ActivityOption = {
  slug: string;
  label: string;
};

const inputClass =
  "w-full rounded-xl border border-forest-light bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/50 focus:border-water-deep focus:outline-none focus:ring-2 focus:ring-water-deep/30";
const labelClass = "mb-1.5 block text-sm font-bold text-navy";

/** 必須バッジ（ラベルは言語ごとに異なるため props で受け取る） */
function Required({ label }: { label: string }) {
  return (
    <span className="ml-1.5 rounded bg-water-deep px-1.5 py-0.5 text-[10px] font-bold text-white">
      {label}
    </span>
  );
}

/**
 * 予約フォーム。
 * /[locale]/reservation?activity=<slug> で希望アクティビティを初期選択できます。
 * 外国語ページではフリガナ（ローマ字表記）を必須にしません。
 */
export default function ReservationForm({
  locale,
  strings,
  activityOptions,
  initialActivity,
}: {
  locale: Locale;
  strings: ReservationFormStrings;
  activityOptions: ActivityOption[];
  initialActivity?: string;
}) {
  const isJa = locale === "ja";
  const validInitial = activityOptions.some((a) => a.slug === initialActivity)
    ? (initialActivity as string)
    : "";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const f = strings.fields;
  const req = <Required label={strings.required} />;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // 二重送信防止

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      locale,
      lastName: String(data.get("lastName") ?? ""),
      firstName: String(data.get("firstName") ?? ""),
      furigana: String(data.get("furigana") ?? ""),
      birthdate: String(data.get("birthdate") ?? ""),
      country: String(data.get("country") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      contactLanguage: String(data.get("contactLanguage") ?? ""),
      stayArea: String(data.get("stayArea") ?? ""),
      activity: String(data.get("activity") ?? ""),
      preferredDate: String(data.get("preferredDate") ?? ""),
      preferredTime: String(data.get("preferredTime") ?? ""),
      participants: String(data.get("participants") ?? ""),
      ageComposition: String(data.get("ageComposition") ?? ""),
      message: String(data.get("message") ?? ""),
      agree: data.get("agree") === "on",
      website: String(data.get("website") ?? ""),
      sourcePath: typeof window !== "undefined" ? window.location.pathname : "",
    };

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as { ok: boolean; message?: string };
      if (result.ok) {
        setStatus("success");
        form.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setErrorMessage(result.message ?? strings.errorNetwork);
      }
    } catch {
      setStatus("error");
      setErrorMessage(strings.errorNetwork);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card md:p-12">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-forest" />
        <h2 className="mt-5 font-display text-2xl font-bold text-navy">
          {strings.successTitle}
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-loose text-ink-soft">
          {strings.successBody}
        </p>
        <p className="mt-3 text-sm font-bold leading-loose text-navy">
          {strings.successStrong}
        </p>
        <p className="mt-6 text-xs leading-relaxed text-ink-soft">
          {strings.successNote}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-card md:p-10">
      {/* ハニーポット（スパム対策・画面には表示されない） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lastName" className={labelClass}>
            {f.lastName} {req}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            autoComplete="family-name"
            placeholder={isJa ? f.lastNamePlaceholder : ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="firstName" className={labelClass}>
            {f.firstName} {req}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            autoComplete="given-name"
            placeholder={isJa ? f.firstNamePlaceholder : ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* 日本語ページのみフリガナ必須。外国語ページはローマ字表記（任意） */}
      <div className="mt-5">
        <label htmlFor="furigana" className={labelClass}>
          {isJa ? f.furigana : f.furiganaForeign} {isJa && req}
        </label>
        <input
          type="text"
          id="furigana"
          name="furigana"
          required={isJa}
          placeholder={isJa ? f.furiganaPlaceholder : ""}
          className={inputClass}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="birthdate" className={labelClass}>
            {f.birthdate} {req}
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
        <div>
          <label htmlFor="country" className={labelClass}>
            {f.country}
          </label>
          <input
            type="text"
            id="country"
            name="country"
            autoComplete="country-name"
            placeholder={f.countryPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {f.phone} {req}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder={isJa ? f.phonePlaceholder : "+81 90-1234-5678"}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{f.phoneHint}</p>
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {f.email} {req}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder={f.emailPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contactLanguage" className={labelClass}>
            {f.contactLanguage}
          </label>
          <select
            id="contactLanguage"
            name="contactLanguage"
            defaultValue={locale}
            className={inputClass}
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeConfig[item].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="stayArea" className={labelClass}>
            {f.stayArea}
          </label>
          <input
            type="text"
            id="stayArea"
            name="stayArea"
            placeholder={f.stayAreaPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="activity" className={labelClass}>
          {f.activity} {req}
        </label>
        <select
          id="activity"
          name="activity"
          required
          defaultValue={validInitial}
          className={inputClass}
        >
          <option value="" disabled>
            {f.activityPlaceholder}
          </option>
          {activityOptions.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredDate" className={labelClass}>
            {f.preferredDate} {req}
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
            {f.preferredTime}
          </label>
          <input
            type="text"
            id="preferredTime"
            name="preferredTime"
            placeholder={f.preferredTimePlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="participants" className={labelClass}>
            {f.participants} {req}
          </label>
          <input
            type="text"
            id="participants"
            name="participants"
            required
            placeholder={f.participantsPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ageComposition" className={labelClass}>
            {f.ageComposition}
          </label>
          <input
            type="text"
            id="ageComposition"
            name="ageComposition"
            placeholder={f.ageCompositionPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={f.messagePlaceholder}
          className={inputClass}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-water-light/60 p-4 text-xs leading-relaxed text-ink">
        {strings.notice}
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
            {f.agree} {req}
            <Link
              href={localePath(locale, "/privacy")}
              target="_blank"
              className="ml-2 whitespace-nowrap text-xs font-bold text-water-deep underline underline-offset-2 hover:text-navy"
            >
              {f.agreeLink}
            </Link>
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
        className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-water-deep px-6 text-base font-bold text-white shadow-card transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin" />
            {strings.submitting}
          </>
        ) : (
          strings.submit
        )}
      </button>
    </form>
  );
}

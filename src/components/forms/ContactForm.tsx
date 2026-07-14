"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { localeConfig, locales, type Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

type Status = "idle" | "submitting" | "success" | "error";

export type ContactFormStrings = {
  fields: Record<string, string>;
  agree: string;
  agreeLink: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  required: string;
  errorNetwork: string;
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

export default function ContactForm({
  locale,
  strings,
}: {
  locale: Locale;
  strings: ContactFormStrings;
}) {
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
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      contactLanguage: String(data.get("contactLanguage") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      agree: data.get("agree") === "on",
      website: String(data.get("website") ?? ""),
      sourcePath: typeof window !== "undefined" ? window.location.pathname : "",
    };

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-card md:p-10">
      {/* ハニーポット（スパム対策・画面には表示されない） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          type="text"
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          {f.name} {req}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder={locale === "ja" ? f.namePlaceholder : ""}
          className={inputClass}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
            placeholder="example@email.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            {f.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder={locale === "ja" ? "09012345678" : "+81 90-1234-5678"}
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
          <label htmlFor="subject" className={labelClass}>
            {f.subject}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder={f.subjectPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          {f.message} {req}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={f.messagePlaceholder}
          className={inputClass}
        />
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
            {strings.agree} {req}
            <Link
              href={localePath(locale, "/privacy")}
              target="_blank"
              className="ml-2 whitespace-nowrap text-xs font-bold text-water-deep underline underline-offset-2 hover:text-navy"
            >
              {strings.agreeLink}
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

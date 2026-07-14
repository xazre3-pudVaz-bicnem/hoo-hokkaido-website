"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

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

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // 二重送信防止

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      agree: formData.get("agree") === "on",
      website: String(formData.get("website") ?? ""),
    };

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
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
          お問い合わせを受け付けました
        </h2>
        <p className="mt-4 text-sm leading-loose text-ink-soft">
          内容を確認のうえ、担当者からご連絡いたします。
          <br />
          今しばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-card md:p-10">
      {/* ハニーポット（スパム対策・画面には表示されない） */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Webサイト</label>
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
          お名前 <Required />
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="山田 太郎"
          className={inputClass}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
        <div>
          <label htmlFor="phone" className={labelClass}>
            電話番号
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="09012345678"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="subject" className={labelClass}>
          件名
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="例：団体利用の相談"
          className={inputClass}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          お問い合わせ内容 <Required />
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="お問い合わせ内容をご記入ください"
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
          "送信する"
        )}
      </button>
    </form>
  );
}

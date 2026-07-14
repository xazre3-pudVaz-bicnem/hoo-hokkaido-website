import Link from "next/link";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/layout/Logo";
import FooterLanguageLinks from "@/components/layout/FooterLanguageLinks";
import { footerLinks, phoneFor, site } from "@/data/site";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localePath } from "@/i18n/routing";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  const phone = phoneFor(locale);
  const links = dict.footer.links as Record<string, string>;

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo locale={locale} inverted withText />
            <address className="mt-6 space-y-3 not-italic text-sm text-white/80">
              <p className="flex items-start gap-2.5">
                <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sky" />
                {dict.common.addressFull}
              </p>
              <p className="flex items-center gap-2.5">
                <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-sky" />
                {dict.common.hoursTimezoneNote}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-sky" />
                <a href={phone.link} className="transition-colors hover:text-sky">
                  {phone.display}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-sky" />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all transition-colors hover:text-sky"
                >
                  {site.email}
                </a>
              </p>
            </address>
            <p className="mt-5 text-xs leading-relaxed text-white/60">
              {dict.common.formAvailable24h}
            </p>
          </div>

          <div>
            <nav aria-label={dict.footer.nav}>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                {footerLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={localePath(locale, link.href)}
                      className="text-white/80 transition-colors hover:text-sky"
                    >
                      {links[link.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 対応言語一覧 */}
            <div className="mt-10 rounded-2xl bg-white/[0.06] p-5">
              <p className="flex items-center gap-2 text-xs font-bold text-sky">
                <Globe aria-hidden="true" className="h-4 w-4" />
                {dict.languagesSection.listLabel}
              </p>
              <FooterLanguageLinks locale={locale} />
              <p className="mt-3 text-xs leading-relaxed text-white/55">
                {dict.languagesSection.note}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-6 text-center text-xs text-white/55">
          <p>
            &copy; {year} {site.name}. {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { footerLinks, site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo inverted />
            <address className="mt-6 space-y-3 not-italic text-sm text-white/80">
              <p className="flex items-start gap-2.5">
                <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-sky" />
                {site.address.full}
              </p>
              <p className="flex items-center gap-2.5">
                <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-sky" />
                営業時間 {site.hours.display}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-sky" />
                <a
                  href={site.tel.link}
                  className="transition-colors hover:text-sky"
                >
                  {site.tel.display}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-sky" />
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-sky"
                >
                  {site.email}
                </a>
              </p>
            </address>
            <p className="mt-5 text-xs leading-relaxed text-white/60">
              営業時間外も、お問い合わせフォームから24時間ご連絡いただけます。
            </p>
          </div>

          <nav aria-label="フッターナビゲーション">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 transition-colors hover:text-sky"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 border-t border-white/15 pt-6 text-center text-xs text-white/55">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

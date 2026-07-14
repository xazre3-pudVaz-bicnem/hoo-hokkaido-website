import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FadeIn from "@/components/ui/FadeIn";
import FinalCta from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { projects } from "@/data/projects";

export const metadata = pageMetadata({
  title: "プロジェクト｜河川管理・場づくり・地域活性化",
  description:
    "HOOはアクティビティの提供に加え、河川管理と保全活動、くつろぎと交流の場づくり、観光と地域経済の活性化に取り組んでいます。北海道の川と地域の未来を育てるプロジェクトをご紹介します。",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="HOOのプロジェクト"
        lead={
          "アクティビティを届けるだけでは、川と地域の未来は守れない。\nHOOは、北海道の水辺と地域を育てる3つの取り組みを続けています。"
        }
      />
      <Breadcrumbs
        items={[
          { name: "ホーム", path: "/" },
          { name: "プロジェクト", path: "/projects" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-12 md:px-6 md:py-16">
        {projects.map((project, index) => (
          <FadeIn key={project.slug}>
            <section
              id={project.slug}
              className="scroll-mt-28"
              aria-labelledby={`${project.slug}-title`}
            >
              <div
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-water-deep">
                    Project {String(index + 1).padStart(2, "0")} — {project.titleEn}
                  </p>
                  <h2
                    id={`${project.slug}-title`}
                    className="mt-3 font-display text-2xl font-bold leading-relaxed text-navy md:text-3xl"
                  >
                    {project.title}
                  </h2>
                  {project.description.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-sm leading-loose text-ink-soft md:text-[15px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {project.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-forest-light bg-white p-6 shadow-card"
                  >
                    <CheckCircle2 aria-hidden="true" className="h-6 w-6 text-forest" />
                    <h3 className="mt-3 text-[15px] font-bold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>
        ))}
      </div>

      <FinalCta
        title={"川と地域の未来も、\n一緒に楽しみながら。"}
        lead="プロジェクトに関するご相談・連携のお問い合わせも歓迎しています。"
      />
    </>
  );
}

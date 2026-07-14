import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { activities } from "@/data/activities";
import { getAllColumns } from "@/lib/column";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 },
    { path: "/activities", priority: 0.9 },
    { path: "/furano-activity", priority: 0.9 },
    { path: "/furano-rafting", priority: 0.9 },
    { path: "/reservation", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/projects", priority: 0.6 },
    { path: "/safety", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/access", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/column", priority: 0.7 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/sitemap", priority: 0.3 },
  ];

  const activityEntries = activities.map((a) => ({
    url: `${site.url}/activities/${a.slug}`,
    lastModified: new Date(),
    priority: a.slug === "furano-relax-downriver" ? 0.95 : 0.8,
  }));

  const columnEntries = getAllColumns().map((p) => ({
    url: `${site.url}/column/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt),
    priority: 0.6,
  }));

  return [
    ...staticPaths.map((entry) => ({
      url: `${site.url}${entry.path}`,
      lastModified: new Date(),
      priority: entry.priority,
    })),
    ...activityEntries,
    ...columnEntries,
  ];
}

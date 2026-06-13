export default function sitemap() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mavimaris.com";

  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-06-13"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.vishwanadeen.lk/",
      priority: 1,
    },
    {
      url: "https://www.vishwanadeen.lk/about",
      priority: 0.8,
    },
    {
      url: "https://www.vishwanadeen.lk/projects",
      priority: 0.9,
    },
    {
      url: "https://www.vishwanadeen.lk/contact",
      priority: 0.7,
    },
  ];
}
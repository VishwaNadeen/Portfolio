import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.vishwanadeen.lk",
      lastModified: new Date(),
    },
    {
      url: "https://www.vishwanadeen.lk/about",
      lastModified: new Date(),
    },
    {
      url: "https://www.vishwanadeen.lk/projects",
      lastModified: new Date(),
    },
    {
      url: "https://www.vishwanadeen.lk/contact",
      lastModified: new Date(),
    },
  ];
}
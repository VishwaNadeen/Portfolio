export type Project = {
  title: string;
  description?: string;
  tech?: string[];
  link?: string;
  githubUrl?: string;
  type?: string;
  platform?: string;
  stars?: number;
  forks?: number;
};

export const projects: Project[] = [
  {
    title: "Clean Water & Sanitation System",
    description: "Backend + APIs for management modules with validation and auth.",
    tech: ["Node.js", "Express", "MongoDB"],
    link: "https://github.com/yourname/repo",
    githubUrl: "https://github.com/yourname/repo",
    type: "Full Stack",
    platform: "Web",
    stars: 0,
    forks: 0,
  },
];
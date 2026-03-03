export type Project = {
  title: string;
  description: string;
  tech: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    title: "Clean Water & Sanitation System",
    description: "Backend + APIs for management modules with validation and auth.",
    tech: ["Node.js", "Express", "MongoDB"],
    link: "https://github.com/yourname/repo",
  },
];
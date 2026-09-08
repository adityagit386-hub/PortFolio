export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    icon: "code",
    skills: ["Python", "Java", "C++", "SQL"],
  },
  {
    title: "AI / Data",
    icon: "brain",
    skills: ["Machine Learning", "Pandas", "Data Analysis"],
  },
  {
    title: "Frontend",
    icon: "layout",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    title: "Backend / Development",
    icon: "server",
    skills: ["Django", "Flask"],
  },
  {
    title: "Database",
    icon: "database",
    skills: ["MySQL", "Supabase"],
  },
  {
    title: "Developer Tools",
    icon: "tools",
    skills: ["Git", "GitHub", "VS Code"],
  },
];

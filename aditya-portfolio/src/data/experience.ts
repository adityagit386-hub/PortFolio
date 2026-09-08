export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  highlights: string[];
}

export const experienceItems: ExperienceItem[] = [
  {
    role: "Intern – Full Stack Python Developer",
    company: "Sumago Infotech Pvt. Ltd",
    location: "Nashik, Maharashtra",
    duration: "June 2024 – July 2024",
    description:
      "Developed web applications using Python and Django and integrated frontend and backend functionality to improve user experience.",
    highlights: [
      "Developed Python-based web applications.",
      "Worked with Django architecture.",
      "Integrated frontend and backend components.",
      "Improved functionality and usability of web applications.",
    ],
  },
];

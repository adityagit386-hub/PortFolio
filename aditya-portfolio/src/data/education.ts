export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  score: string;
  scoreLabel: string;
  current?: boolean;
}

export const educationItems: EducationItem[] = [
  {
    degree: "B.Tech",
    field: "Artificial Intelligence & Machine Learning",
    institution: "Sanjivani University",
    location: "Kopargaon",
    period: "Expected Graduation: May 2028",
    score: "8.32",
    scoreLabel: "CGPA",
    current: true,
  },
  {
    degree: "Diploma",
    field: "Computer Technology",
    institution: "Amrutvahini Polytechnic",
    location: "Sangamner",
    period: "Completed: May 2025",
    score: "82.51%",
    scoreLabel: "Percentage",
  },
  {
    degree: "SSC",
    field: "Secondary School Certificate",
    institution: "Mangaleshwar Vidyalaya",
    location: "Mangalapur",
    period: "Completed: May 2022",
    score: "91.20%",
    scoreLabel: "Percentage",
  },
];

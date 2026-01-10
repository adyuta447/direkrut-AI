import { Job, Application } from "./types";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Innovators Inc",
    location: "Jakarta",
    type: "Full-time",
    department: "Engineering",
    description:
      "We are looking for a skilled Frontend Developer to join our team.",
    requirements: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "2+ years experience",
    ],
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Backend Engineer",
    company: "Cloud Solutions Ltd",
    location: "Bandung",
    type: "Full-time",
    department: "Engineering",
    description: "Join our backend team to build scalable cloud solutions.",
    requirements: ["Node.js", "PostgreSQL", "Docker", "3+ years experience"],
    posted: "5 days ago",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Creative Digital Agency",
    location: "Remote",
    type: "Contract",
    department: "Design",
    description: "Create beautiful and intuitive user experiences.",
    requirements: ["Figma", "Adobe XD", "User Research", "Portfolio required"],
    posted: "1 week ago",
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Surabaya",
    type: "Full-time",
    department: "Data",
    description: "Analyze large datasets and build predictive models.",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    posted: "3 days ago",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "Infrastructure Masters",
    location: "Jakarta",
    type: "Full-time",
    department: "Platform",
    description: "Manage and optimize our cloud infrastructure.",
    requirements: ["AWS", "Kubernetes", "CI/CD", "Terraform"],
    posted: "1 day ago",
  },
];

export const mockApplications: Application[] = [
  {
    id: "app1",
    applicantId: "user1",
    applicantName: "Budi Santoso",
    jobId: "1",
    jobTitle: "Frontend Developer",
    resumeLink: "https://example.com/cv/budi-santoso.pdf",
    cvSummary:
      "5 years of experience in React development with strong TypeScript skills.",
    validationStatus: "completed",
    recommendationScore: 92,
    status: "under-review",
    appliedDate: "2024-01-05",
    authenticityScore: {
      authentic: 85,
      generic: 10,
      aiGenerated: 5,
    },
    validationResponses: [
      {
        question: "Explain your experience with React hooks",
        answer:
          "I have extensively used useState, useEffect, and custom hooks...",
      },
      {
        question: "How do you handle state management?",
        answer:
          "I prefer using Context API for simple apps and Redux for complex...",
      },
    ],
  },
  {
    id: "app2",
    applicantId: "user2",
    applicantName: "Siti Rahayu",
    jobId: "2",
    jobTitle: "Backend Engineer",
    resumeLink: "https://example.com/cv/siti-rahayu.pdf",
    cvSummary:
      "4 years building scalable APIs with Node.js and microservices architecture.",
    validationStatus: "completed",
    recommendationScore: 88,
    status: "interview",
    appliedDate: "2024-01-04",
    authenticityScore: {
      authentic: 90,
      generic: 7,
      aiGenerated: 3,
    },
  },
  {
    id: "app3",
    applicantId: "user3",
    applicantName: "Ahmad Hidayat",
    jobId: "1",
    jobTitle: "Frontend Developer",
    resumeLink: "https://example.com/cv/ahmad-hidayat.pdf",
    cvSummary: "2 years experience in web development with React and Vue.js.",
    validationStatus: "completed",
    recommendationScore: 75,
    status: "submitted",
    appliedDate: "2024-01-06",
    authenticityScore: {
      authentic: 70,
      generic: 20,
      aiGenerated: 10,
    },
  },
];

export const validationQuestions = [
  "Can you describe your most challenging project and how you overcame obstacles?",
  "What specific technologies from your CV are you most proficient in?",
  "How do you stay updated with the latest developments in your field?",
  "Describe a situation where you had to learn a new technology quickly.",
  "What makes you a good fit for this specific role?",
];

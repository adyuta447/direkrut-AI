export function generateQuestions(jobTitle: string) {
  return [
    `Tell me about your background and why you applied for the ${jobTitle} position.`,
    `What's the most technically challenging problem you've solved recently? Walk me through your approach.`,
    `How do you stay up-to-date with industry developments relevant to ${jobTitle}?`,
    `Describe a situation where you had to collaborate with a difficult stakeholder. How did you handle it?`,
    `Where do you see yourself in 2-3 years, and how does this role align with your goals?`,
  ];
}

export const candidateResponses = [
  "I've been in the industry for several years and am excited about this opportunity because it aligns well with my skill set and career goals...",
  "One challenging project involved optimizing a critical data pipeline that was causing bottlenecks. I used profiling tools to identify the bottleneck and refactored the code to improve performance by 40%...",
  "I follow industry blogs, attend webinars, participate in online communities, and regularly complete courses to stay current with best practices...",
  "I once worked with a stakeholder who had conflicting priorities. I scheduled a dedicated meeting to understand their perspective and found a middle ground that satisfied both parties...",
  "In 2-3 years, I aim to take on senior responsibilities and mentor junior team members. This role gives me the ideal environment to develop those skills while contributing meaningfully...",
];

export function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

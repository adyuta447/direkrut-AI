import { useState } from "react";
import { useApp } from "../../context/AppContext";

export function useApplyForm(onSubmitted: () => void) {
  const { currentUser, addApplication, jobs } = useApp();
  const [selectedJob, setSelectedJob] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillError, setSkillError] = useState("");

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setSkillError("");
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCvFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setCvFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !cvFile) return;
    if (skills.length < 3) {
      setSkillError("Isi minimal 3 keahlian untuk meningkatkan akurasi pencocokan.");
      return;
    }
    setSkillError("");

    const job = jobs.find((j) => j.id === selectedJob);
    if (!job) return;

    addApplication({
      id: Math.random().toString(36).substr(2, 9),
      applicantId: currentUser!.id,
      applicantName: currentUser!.name,
      jobId: job.id,
      jobTitle: job.title,
      cvFile: cvFile,
      validationStatus: "pending",
      status: "submitted",
      appliedDate: "Hari ini",
      cvViewed: false,
    });

    onSubmitted();
  };

  const selectedJobData = jobs.find((j) => j.id === selectedJob);

  return {
    jobs, selectedJob, setSelectedJob, selectedJobData,
    cvFile, isDragging, setIsDragging,
    skillInput, setSkillInput, skills, skillError,
    addSkill, removeSkill,
    handleFileChange, handleDrop, handleSubmit,
  };
}

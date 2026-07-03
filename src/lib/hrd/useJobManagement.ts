"use client";

import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Job } from "../../types";
import { validateJobForm } from "./jobValidation";
import { buildJobPayload } from "./jobPayload";

export interface JobFormState {
  title: string;
  department: string;
  description: string;
  // REVISI 6: Pisahkan kualifikasi (admin) dan keahlian (teknis)
  qualificationsText: string;
  requirementsText: string;
  location: string;
  type: string;
  company: string;
}

const initialForm: JobFormState = {
  title: "",
  department: "",
  description: "",
  qualificationsText: "",
  requirementsText: "",
  location: "Jakarta",
  type: "Purna Waktu",
  company: "Direkrut AI",
};

export function useJobManagement() {
  const { jobs, addJob, updateJob } = useApp();
  const [form, setForm] = useState<JobFormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormState, string>>>({});

  const totalDepartments = useMemo(() => new Set(jobs.map((job) => job.department)).size, [jobs]);

  const setField = (key: keyof JobFormState, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateJobForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setMessage("");
      return;
    }

    const existingJob: Job | undefined = jobs.find((job) => job.id === editingId);
    const payload = buildJobPayload(form, editingId, existingJob);

    if (editingId) {
      updateJob(payload.id, payload);
      setMessage("Lowongan berhasil diperbarui.");
    } else {
      addJob(payload);
      setMessage("Lowongan berhasil ditambahkan dan kini terlihat di portal karir.");
    }

    setForm(initialForm);
    setEditingId(null);
    setErrors({});
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      description: job.description,
      qualificationsText: (job.detailedQualifications ?? []).join(", "),
      requirementsText: job.requirements.join(", "),
      location: job.location,
      type: job.type,
      company: job.company,
    });
    setErrors({});
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    setMessage("");
  };

  return { jobs, form, setField, editingId, message, errors, totalDepartments, handleSubmit, handleEdit, cancelEdit };
}

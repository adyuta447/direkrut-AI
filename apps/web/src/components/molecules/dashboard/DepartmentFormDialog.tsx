"use client";

import { useState } from "react";
import {
  IconBuildingSkyscraper,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Department } from "@/lib/types";

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSubmit: (values: {
    name: string;
    description: string;
  }) => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setName(department?.name ?? "");
      setDescription(department?.description ?? "");
      setSubmitError("");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Departemen belum berhasil diperbarui. Coba lagi ya.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconBuildingSkyscraper className="size-6" />
            </span>
            <div className="space-y-1">
              <DialogTitle className="text-[22px]">
                {department ? "Edit Departemen" : "Departemen Baru"}
              </DialogTitle>
              <DialogDescription>
                {department
                  ? "Ubah namanya, langsung kepakai di semua lowongan terkait."
                  : "Tambah departemen biar pilihan di form lowongan makin rapi."}
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Nama Departemen</Label>
              <Input
                id="dept-name"
                placeholder="Contoh: Engineering"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dept-desc">Deskripsi (Opsional)</Label>
              <Textarea
                id="dept-desc"
                placeholder="Sekilas tentang tim ini ngerjain apa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20"
              />
            </div>
          </div>

          {submitError ? (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {submitError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-hairline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <IconLoader2 className="mr-2 size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : department ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Departemen"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

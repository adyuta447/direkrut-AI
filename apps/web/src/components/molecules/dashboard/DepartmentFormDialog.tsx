"use client";

import { useState } from "react";
import { IconBuildingSkyscraper } from "@tabler/icons-react";
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
  onSubmit: (values: { name: string; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setName(department?.name ?? "");
      setDescription(department?.description ?? "");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-hairline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {department ? "Simpan Perubahan" : "Tambah Departemen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

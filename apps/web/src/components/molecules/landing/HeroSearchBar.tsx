"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { TextFilterField } from "../../atoms/jobs/TextFilterField";

export function HeroSearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    const query = params.toString();
    router.push(query ? `/jobs?${query}` : "/jobs");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-center gap-1 bg-canvas border border-hairline rounded-3xl sm:rounded-full p-2 focus-within:border-primary"
    >
      <TextFilterField
        icon={Search}
        label="Posisi"
        placeholder="Jabatan, kata kunci, atau perusahaan"
        value={keyword}
        onChange={setKeyword}
        className="flex-1"
      />
      <div className="hidden sm:block w-px h-8 bg-hairline flex-shrink-0" />
      <div className="sm:hidden h-px bg-hairline mx-6" />
      <TextFilterField
        icon={MapPin}
        label="Lokasi"
        placeholder="Kota atau WFH"
        value={location}
        onChange={setLocation}
        className="flex-1"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-primary text-white rounded-3xl sm:rounded-full h-11 sm:h-14 px-9 text-[14px] font-medium hover:bg-primary-strong transition-none flex-shrink-0 mt-1 sm:mt-0"
      >
        <Search className="w-4 h-4" strokeWidth={1.5} />
        Cari
      </button>
    </form>
  );
}

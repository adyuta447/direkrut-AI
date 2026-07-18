"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"

const NOTICE_COPY: Record<string, string> = {
  created: "Lowongan baru udah gas tayang",
  draft: "Draft tersimpan, lanjutin kapan aja",
}

/** Baca ?notice= dari URL (dipakai redirect abis create/edit lowongan),
 * tampilin sebagai dialog sekali, terus bersihin query string-nya. */
export function JobsNoticeFromUrl() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const key = searchParams.get("notice")
  // Notice-nya diturunin sekali dari URL lewat lazy initializer (bukan
  // di-set di efek) -- efeknya cuma buat bersihin query string.
  const [notice, setNotice] = useState<string | null>(() => (key && NOTICE_COPY[key]) || null)

  useEffect(() => {
    if (key && NOTICE_COPY[key]) {
      router.replace("/hrd/jobs")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return <NoticeDialog message={notice} onClose={() => setNotice(null)} />
}

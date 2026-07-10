interface JobQualificationsProps {
  qualifications?: string[];
}

export function JobQualifications({ qualifications }: JobQualificationsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-[20px] font-normal mb-4 text-ink">Kualifikasi Detail</h3>
      <ul className="list-disc pl-5 space-y-2">
        {qualifications?.map((qual, idx) => (
          <li key={idx} className="text-[16px] leading-[1.5] text-ink">
            {qual}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface JobInterviewQuestionsProps {
  questions?: string[];
}

export function JobInterviewQuestions({ questions }: JobInterviewQuestionsProps) {
  return (
    <div>
      <h3 className="text-[20px] font-normal mb-4 text-ink">Pertanyaan Wawancara</h3>
      <p className="text-[14px] text-ink-muted mb-4">
        Anda akan diminta menjawab pertanyaan berikut saat wawancara AI:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        {questions?.map((q, idx) => (
          <li key={idx} className="text-[14px] leading-[1.5] text-ink">
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
}

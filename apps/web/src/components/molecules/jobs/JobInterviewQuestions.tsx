interface JobInterviewQuestionsProps {
  questions?: string[];
}

export function JobInterviewQuestions({ questions }: JobInterviewQuestionsProps) {
  return (
    <div>
      <h3 className="text-[20px] font-semibold mb-4 text-ink">Pertanyaan Wawancara</h3>
      <p className="text-[14px] text-ink-muted mb-4">
        Pertanyaan ini bakal muncul di interview AI, jadi kamu bisa siapin jawabannya dari sekarang:
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

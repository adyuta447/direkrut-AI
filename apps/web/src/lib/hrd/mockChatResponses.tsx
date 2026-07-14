import { ReactNode } from "react";
import { Application } from "../../types";
import { ChatResponse } from "./chatTypes";
import { buildTopCandidatesResponse, buildExperienceResponse } from "./chatScenarios/topAndExperience";
import { buildCommunicationResponse, buildStatsResponse } from "./chatScenarios/communicationAndStats";
import { buildCompareResponse } from "./chatScenarios/compare";
import {
  buildFreshGraduateResponse,
  buildLongWaitingResponse,
  buildDefaultResponse,
} from "./chatScenarios/freshGradWaitingDefault";

export function findCandidateId(applications: Application[], nameQuery: string) {
  const candidate = applications.find((a) => a.applicantName.toLowerCase().includes(nameQuery.toLowerCase()));
  return candidate ? candidate.id : applications[0]?.id;
}

export function getInitialMessageText(userName: string | undefined, jobTitle: string): ReactNode {
  return (
    <>
      <p className="text-[16px] mb-2 font-medium">Halo, {userName}!</p>
      <p className="text-[14px]">
        Saya Asisten AI Anda, siap membantu menganalisis kandidat untuk posisi <strong className="text-primary">{jobTitle}</strong>.
      </p>
      <br />
      <p className="text-[14px]">Anda dapat menanyakan berbagai hal mulai dari perbandingan kandidat, pencarian skill spesifik, hingga laporan statistik rekrutmen.</p>
      <br />
      <p className="text-[14px]">Ada yang ingin Anda cari hari ini?</p>
    </>
  );
}

export function wrapPlainText(text: string): ReactNode {
  return <div className="text-[14px]">{text}</div>;
}

export function processResponse(text: string, jobTitle: string, reqs: string[]): ChatResponse {
  const lower = text.toLowerCase();
  const req1 = reqs[0] || "Skill A";
  const req2 = reqs[1] || "Skill B";
  const req3 = reqs[2] || "Skill C";
  const req4 = reqs[3] || "Skill D";

  if (lower.match(/terbaik|paling cocok|rekomendasi|siapa yang bagus|3 kandidat teratas/)) {
    return buildTopCandidatesResponse(jobTitle, req1, req2, req3);
  }
  if (lower.match(/pengalaman paling banyak|paling senior|paling lama bekerja/)) {
    return buildExperienceResponse(jobTitle, req2);
  }
  if (lower.match(/komunikasi|komunikasinya bagus|lancar ngomong|soft skill/)) {
    return buildCommunicationResponse(jobTitle, req1);
  }
  if (lower.match(/bandingkan|compare|vs/)) {
    return buildCompareResponse(lower, jobTitle, req1, req2, req3, req4);
  }
  if (lower.match(/berapa|statistik|total|sudah berapa|progress/)) {
    return buildStatsResponse(jobTitle);
  }
  if (lower.match(/fresh graduate|baru lulus|junior|entry level/)) {
    return buildFreshGraduateResponse(jobTitle, req3, req1);
  }
  if (lower.match(/sudah lama menunggu|belum direspons|ghosting|yang pending lama|paling lama/)) {
    return buildLongWaitingResponse(jobTitle, req1);
  }
  return buildDefaultResponse(jobTitle, req2);
}

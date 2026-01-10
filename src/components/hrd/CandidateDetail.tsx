import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import DecisionPanel from "./DecisionPanel";

interface CandidateDetailProps {
  candidateId: string;
}

export default function CandidateDetail({ candidateId }: CandidateDetailProps) {
  const { applications } = useApp();
  const [showDecisionPanel, setShowDecisionPanel] = useState(false);
  const [decision, setDecision] = useState<"invite" | "reject" | null>(null);

  const candidate = applications.find((app) => app.id === candidateId);

  if (!candidate) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Candidate not found</p>
      </div>
    );
  }

  const handleDecision = (type: "invite" | "reject") => {
    setDecision(type);
    setShowDecisionPanel(true);
  };

  if (showDecisionPanel && decision) {
    return (
      <DecisionPanel
        candidate={candidate}
        decision={decision}
        onBack={() => setShowDecisionPanel(false)}
      />
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-3xl">
                {candidate.applicantName.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {candidate.applicantName}
              </h1>
              <p className="text-xl text-gray-600 mb-3">{candidate.jobTitle}</p>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {candidate.applicantId}@example.com
                </span>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  +62 812-3456-7890
                </span>
                {candidate.resumeLink && (
                  <a
                    href={candidate.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    CV PDF
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Match Score</p>
            <p className="text-5xl font-bold text-blue-600">
              {candidate.recommendationScore || "--"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-gray-900 capitalize">
              {candidate.status}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Applied Date</p>
            <p className="font-semibold text-gray-900">
              {candidate.appliedDate}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            CV Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {candidate.cvSummary || "No summary available"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Authenticity Analysis
        </h2>

        {candidate.authenticityScore ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Authentic Content
                </span>
                <span className="font-bold text-green-600">
                  {candidate.authenticityScore.authentic}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${candidate.authenticityScore.authentic}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-yellow-600" />
                  Generic Responses
                </span>
                <span className="font-bold text-yellow-600">
                  {candidate.authenticityScore.generic}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full"
                  style={{ width: `${candidate.authenticityScore.generic}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium flex items-center">
                  <XCircle className="w-4 h-4 mr-2 text-orange-600" />
                  AI-Generated Content
                </span>
                <span className="font-bold text-orange-600">
                  {candidate.authenticityScore.aiGenerated}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-600 h-3 rounded-full"
                  style={{
                    width: `${candidate.authenticityScore.aiGenerated}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-900 font-semibold mb-1">
                Analysis Summary
              </p>
              <p className="text-blue-700 text-sm">
                This candidate shows{" "}
                {candidate.authenticityScore.authentic >= 80
                  ? "high authenticity"
                  : candidate.authenticityScore.authentic >= 60
                  ? "moderate authenticity"
                  : "low authenticity"}{" "}
                in their responses. The content appears to be{" "}
                {candidate.authenticityScore.aiGenerated < 15
                  ? "genuine and personally crafted"
                  : "potentially AI-assisted"}
                .
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Authenticity analysis not available</p>
        )}
      </div>

      {candidate.validationResponses &&
        candidate.validationResponses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Validation Log
            </h2>
            <div className="space-y-4">
              {candidate.validationResponses.map((response, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="font-semibold text-gray-900 mb-2">
                    Q: {response.question}
                  </p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    A: {response.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Decision Panel</h2>
        <p className="text-gray-600 mb-6">
          Review the candidate information and make a decision
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleDecision("invite")}
            className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Invite to Interview</span>
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className="flex-1 bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Reject Application</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface AIInterviewPageProps {
  onClose: () => void;
}

export default function AIInterviewPage({ onClose }: AIInterviewPageProps) {
  const [indicators] = useState([
    { id: "eye", label: "Eye Tracking", status: true },
    { id: "outfit", label: "Neat Outfit", status: true },
    { id: "tab", label: "Tab Browser", status: false },
  ]);

  const [metrics] = useState({
    score: 85,
    violations: 2,
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-zinc-900 dark:text-white">
            AI VIDEO INTERVIEW
          </h1>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: User Video */}
        <div className="flex-1 border-r border-zinc-200 dark:border-zinc-800 p-6">
          <div className="h-full bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                USER VIDEO
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="w-96 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
          {/* Indicators Section */}
          <div className="mb-8">
            <div className="space-y-3">
              {indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center ${
                    indicator.status
                      ? "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                  }`}
                >
                  {indicator.label}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Section */}
          <div className="flex gap-3 mb-8">
            {/* Score */}
            <div className="flex-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-[#F0FDF4] dark:bg-green-950">
              <div className="text-xs text-zinc-600 dark:text-green-300 font-medium mb-1">
                Score
              </div>
              <div className="text-2xl font-semibold text-green-700 dark:text-green-400">
                {metrics.score}%
              </div>
            </div>

            {/* Violations */}
            <div className="flex-1 px-4 py-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
              <div className="text-xs text-red-600 dark:text-red-300 font-medium mb-1">
                Violations
              </div>
              <div className="text-2xl font-semibold text-red-700 dark:text-red-400">
                {metrics.violations}
              </div>
            </div>
          </div>

          {/* AI Video - Bottom Right */}
          <div className="flex-1 flex items-end justify-end">
            <div className="w-48 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  AI VIDEO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

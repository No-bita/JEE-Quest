import React from 'react';
import { QuestionStatus } from './QuestionNavigation';

interface LegendCardProps {
  questions: Array<{
    id: number;
    status: QuestionStatus;
    visited: boolean;
  }>;
}

const getLegendCounts = (
  questions: Array<{ id: number; status: QuestionStatus; visited: boolean }>
) => {
  let notVisited = 0;
  let notAnswered = 0;
  let answered = 0;
  let marked = 0;
  let answeredAndMarked = 0;

  questions.forEach((q) => {
    if (!q.visited) notVisited++;
    else if (q.status === 'attempted') answered++;
    else if (q.status === 'marked-unattempted') marked++;
    else if (q.status === 'marked-attempted') answeredAndMarked++;
    else notAnswered++;
  });

  return { notVisited, notAnswered, answered, marked, answeredAndMarked };
};

const LegendCard: React.FC<LegendCardProps> = ({ questions }) => {
  const {
    notVisited,
    notAnswered,
    answered,
    marked,
    answeredAndMarked,
  } = getLegendCounts(questions);

  return (
    <div className="bg-white dark:bg-[#181A20] rounded-xl shadow p-5 mt-6 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-y-2 gap-x-6">
          {/* Not Visited */}
          <div className="flex items-center gap-2">
            <span aria-label={`${notVisited} not visited`} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-400 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal text-sm shadow">{notVisited}</span>
            <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Not Visited</span>
          </div>
          {/* Not Answered */}
          <div className="flex items-center gap-2">
            <span aria-label={`${notAnswered} not answered`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-normal text-sm">{notAnswered}</span>
            <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Not Answered</span>
          </div>
          {/* Answered */}
          <div className="flex items-center gap-2">
            <span aria-label={`${answered} answered`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-normal text-sm">{answered}</span>
            <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Answered</span>
          </div>
          {/* Marked for Review */}
          <div className="flex items-center gap-2">
            <span aria-label={`${marked} marked for review`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-normal text-sm">{marked}</span>
            <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Marked for Review</span>
          </div>
        </div>
        {/* Answered & Marked for Review */}
        <div className="flex items-center gap-2 mt-1 ml-1">
          <span aria-label={`${answeredAndMarked} answered and marked for review`} className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-normal text-sm">
            {answeredAndMarked}
            <svg className="absolute -top-1 right-0 w-3 h-3 text-green-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 16 16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l3 3 5-5" />
            </svg>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-gray-700 dark:text-gray-200 text-sm font-normal">Answered & Marked for Review</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">(will be considered for evaluation)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegendCard;

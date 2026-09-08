'use client';

import React from 'react';

interface Props {
  content: string;
}

export const LegalContentRenderer: React.FC<Props> = ({ content }) => {
  if (!content) {
    return <p className="text-slate-400 italic">No content available.</p>;
  }

  // Split content by double newlines or single newlines for block parsing
  const rawBlocks = content.split(/\n\s*\n/);

  const renderInline = (text: string) => {
    // Replace markdown bold **text** with <strong>
    const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.includes('@') && !part.startsWith('http')) {
        return (
          <a
            key={index}
            href={`mailto:${part}`}
            className="text-blue-700 font-semibold underline hover:text-blue-900"
          >
            {part}
          </a>
        );
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold underline hover:text-blue-900"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
      {rawBlocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Check if block is a Heading 1
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={bIdx} className="font-serif-heading text-xl sm:text-2xl font-bold text-[#07174a] mt-6 mb-2">
              {trimmed.replace(/^#\s+/, '')}
            </h2>
          );
        }

        // Check if block is a Heading 2 (##)
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={bIdx} className="font-serif-heading text-base sm:text-lg font-bold text-[#07174a] mt-4 mb-2">
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          );
        }

        // Check if block is a Heading 3 (###)
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={bIdx} className="font-serif-heading text-sm sm:text-base font-bold text-[#07174a] mt-3 mb-1">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        // Check if block contains bullet items
        const lines = trimmed.split('\n');
        const isList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));

        if (isList) {
          return (
            <ul key={bIdx} className="list-disc pl-5 space-y-1.5 marker:text-amber-500">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>
                  {renderInline(line.trim().replace(/^[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Mixed block with list or regular paragraph
        return (
          <p key={bIdx} className="whitespace-pre-line">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

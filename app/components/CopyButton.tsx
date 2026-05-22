'use client';

import { useState } from 'react';

type CopyButtonProps = {
  text: string;
  label?: string;
};

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={copy} className="copy-button" aria-label={`${label} ${text}`}>
      {copied ? 'Copied' : label}
    </button>
  );
}

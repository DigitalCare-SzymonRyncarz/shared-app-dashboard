import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { cn } from "../utils/cn";
import type { UrlButtonProps } from "../types";

export function UrlButton({ variant, url, label }: UrlButtonProps) {
  const [copied, setCopied] = useState(false);

  const isDisabled = !url;

  function handleClick() {
    if (isDisabled) return;

    if (variant === "env") {
      navigator.clipboard.writeText(url!).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }).catch(() => {
        // Clipboard API unavailable — silent no-op
      });
    } else {
      window.open(url!, "_blank");
    }
  }

  const isCopied = variant === "env" && copied;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={url ?? undefined}
      className={cn(
        "flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors w-full truncate min-h-[32px]",
        isDisabled
          ? "cursor-not-allowed bg-gray-700 text-gray-500"
          : isCopied
          ? "bg-[#00bcc5]/20 text-[#00bcc5] ring-1 ring-[#00bcc5]"
          : "bg-[#150e4f] text-gray-300 hover:bg-[#1e1870] hover:text-white"
      )}
    >
      {variant === "env" ? (
        <Copy size={12} className="shrink-0" />
      ) : (
        <ExternalLink size={12} className="shrink-0" />
      )}
      <span className="truncate">{isCopied ? "Copied!" : label}</span>
    </button>
  );
}

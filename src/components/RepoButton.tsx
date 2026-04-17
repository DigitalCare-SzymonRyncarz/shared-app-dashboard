import { GitFork } from "lucide-react";
import { cn } from "../utils/cn";
import type { RepoButtonProps } from "../types";

export function RepoButton({ url }: RepoButtonProps) {
  const isDisabled = !url;

  function handleClick() {
    if (isDisabled) return;
    window.open(url!, "_blank");
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={url ?? undefined}
      aria-label="Open repository"
      className={cn(
        "flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors min-h-[32px]",
        isDisabled
          ? "cursor-not-allowed bg-gray-700 text-gray-500"
          : "bg-[#150e4f] text-gray-300 hover:bg-[#1e1870] hover:text-white"
      )}
    >
      <GitFork size={14} className="shrink-0" />
      <span>Repo</span>
    </button>
  );
}

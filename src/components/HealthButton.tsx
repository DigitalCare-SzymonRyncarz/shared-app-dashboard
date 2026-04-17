import { Activity, Loader2 } from "lucide-react";
import { cn } from "../utils/cn";
import type { HealthButtonProps } from "../types";

export function HealthButton({ url, status, onCheck }: HealthButtonProps) {
  const isDisabled = !url;

  function handleClick() {
    if (isDisabled) return;
    onCheck();
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={url ?? undefined}
      className={cn(
        "flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors w-full min-h-[32px]",
        isDisabled || status === "unknown"
          ? "cursor-not-allowed bg-gray-700 text-gray-500"
          : status === "loading"
          ? "cursor-wait bg-gray-700 text-gray-400"
          : status === "healthy"
          ? "bg-green-900/50 text-green-400 hover:bg-green-900/70"
          : "bg-red-900/50 text-red-400 hover:bg-red-900/70",
        isDisabled && "cursor-not-allowed"
      )}
    >
      {status === "loading" ? (
        <Loader2 size={12} className="shrink-0 animate-spin" />
      ) : (
        <Activity size={12} className="shrink-0" />
      )}
      <span>Health</span>
    </button>
  );
}

import bolttechLogo from "../assets/bolttech-thumbnailtwitter.avif";
import { cn } from "../utils/cn";

export function Header() {
  return (
    <header className={cn("w-full flex items-center gap-4 px-4 sm:px-6 py-3")} style={{ backgroundColor: "#150e4f" }}>
      <img
        src={bolttechLogo}
        alt="Bolttech logo"
        className="h-10 w-auto shrink-0"
      />
      <span className="text-white text-xl font-semibold tracking-wide truncate min-w-0">
        Applications Dashboard
      </span>
    </header>
  );
}

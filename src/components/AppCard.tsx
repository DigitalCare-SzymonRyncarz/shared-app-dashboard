import { cn } from "../utils/cn";
import { RepoButton } from "./RepoButton";
import { EnvColumn } from "./EnvColumn";
import type { AppCardProps } from "../types";

const ENV_ORDER = ["tst", "uat", "pre", "prd"] as const;

export function AppCard({ app, healthMap, onHealthCheck }: AppCardProps) {
  return (
    <div
      role="region"
      aria-label={app.Name}
      className={cn(
        "rounded-xl p-4 flex flex-col gap-4",
        "bg-[#150e4f]"
      )}
    >
      {/* Card header: app name + repo button */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-white truncate">{app.Name}</h2>
        <RepoButton url={app.repositoryUrl} />
      </div>

      {/* Environment columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ENV_ORDER.map((envName) => {
          const env = app.Environments.find((e) => e.name === envName);
          return (
            <EnvColumn
              key={envName}
              label={envName}
              env={env}
              healthMap={healthMap}
              onHealthCheck={onHealthCheck}
            />
          );
        })}
      </div>
    </div>
  );
}

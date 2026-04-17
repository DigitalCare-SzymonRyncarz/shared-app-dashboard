import { cn } from "../utils/cn";
import { UrlButton } from "./UrlButton";
import { HealthButton } from "./HealthButton";
import type { EnvColumnProps } from "../types";

export function EnvColumn({ label, env, healthMap, onHealthCheck }: EnvColumnProps) {
  const envUrl = env?.url ?? null;
  const swaggerUrl = env?.swaggerUrl ?? null;
  const healthUrl = env?.healthCheckUrl ?? null;
  const status = healthUrl ? (healthMap.get(healthUrl) ?? "unknown") : "unknown";

  return (
    <div className={cn("flex flex-col gap-2")}>
      <span className="text-xs font-bold uppercase tracking-wider text-[#00bcc5]">
        {label}
      </span>
      <UrlButton variant="env" url={envUrl} label={label.toUpperCase()} />
      <UrlButton variant="swagger" url={swaggerUrl} label="Swagger" />
      <HealthButton
        url={healthUrl}
        status={status}
        onCheck={() => healthUrl && onHealthCheck(healthUrl)}
      />
    </div>
  );
}

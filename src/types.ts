// Data models

export interface Environment {
  name: "tst" | "uat" | "pre" | "prd";
  url: string | null;
  swaggerUrl: string | null;
  healthCheckUrl: string | null;
}

export interface Application {
  Name: string;
  repositoryUrl: string | null;
  Environments: Environment[];
}

export interface ApplicationsFile {
  Applications: Application[];
}

// Runtime state

export type HealthStatus = "unknown" | "healthy" | "unhealthy" | "loading";

// Key: healthCheckUrl string
export type HealthMap = Map<string, HealthStatus>;

// Component props

export type UrlButtonVariant = "env" | "swagger";

export interface AppCardProps {
  app: Application;
  healthMap: HealthMap;
  onHealthCheck: (url: string) => void;
}

export interface EnvColumnProps {
  label: string; // "tst" | "uat" | "pre" | "prd"
  env: Environment | undefined; // undefined → all buttons disabled
  healthMap: HealthMap;
  onHealthCheck: (url: string) => void;
}

export interface UrlButtonProps {
  variant: UrlButtonVariant;
  url: string | null | undefined;
  label: string;
}

export interface HealthButtonProps {
  url: string | null | undefined;
  status: HealthStatus;
  onCheck: () => void;
}

export interface RepoButtonProps {
  url: string | null | undefined;
}

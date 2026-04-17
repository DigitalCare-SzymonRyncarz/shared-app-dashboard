import type { Application, ApplicationsFile } from "../types";
import rawData from "../../applications.json";

let _applications: Application[] = [];
let _error: string | null = null;

try {
  const data = rawData as ApplicationsFile;
  _applications = data.Applications;
} catch (e) {
  _error = e instanceof Error ? e.message : String(e);
  _applications = [];
}

export function useApplications(): { applications: Application[]; error: string | null } {
  return { applications: _applications, error: _error };
}

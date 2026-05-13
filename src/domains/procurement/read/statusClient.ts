import { apiUrl } from "../../../lib/api";

export interface ProcurementReadStatus {
  status: string;
  service: string;
  contract: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProcurementReadStatus(value: unknown): ProcurementReadStatus {
  if (!isRecord(value)) {
    throw new Error("Procurement read status response must be an object");
  }

  const { status, service, contract } = value;

  if (typeof status !== "string" || typeof service !== "string" || typeof contract !== "string") {
    throw new Error("Procurement read status response has invalid fields");
  }

  return { status, service, contract };
}

export async function fetchProcurementReadStatus(): Promise<ProcurementReadStatus> {
  const response = await fetch(apiUrl("/procurement/read/v1/status"));

  if (!response.ok) {
    throw new Error(`Procurement read status request failed: ${response.status}`);
  }

  const payload: unknown = await response.json();
  return parseProcurementReadStatus(payload);
}

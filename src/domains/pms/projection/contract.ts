export interface PmsProjectionBoundary {
  readonly sourceSystem: "pms";
  readonly consumerSystem: "procurement";
  readonly rule: "read-api-or-projection-only";
}

export const pmsProjectionBoundary: PmsProjectionBoundary = {
  sourceSystem: "pms",
  consumerSystem: "procurement",
  rule: "read-api-or-projection-only",
};

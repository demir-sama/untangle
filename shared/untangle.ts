import { z } from "zod";

export const findingKind = z.enum([
  "conflict",
  "scope_change",
  "question",
  "consistent",
]);
export const outcome = z.enum(["accepted", "rejected", "needs_answer", "open"]);
export const sourceSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(["baseline", "instruction"]),
  label: z.string().min(1).max(160),
  author: z.string().min(1).max(120),
  text: z.string().min(1).max(12000),
});
export const evidenceSchema = z.object({
  sourceId: z.string().uuid().describe("ID of an existing immutable source"),
  quote: z
    .string()
    .min(1)
    .max(2000)
    .describe("Verbatim, contiguous quote copied exactly from that source"),
});
export const reviewSchema = z.object({
  outcome,
  owner: z.string().min(1).max(120),
  rationale: z.string().min(1).max(2000),
  direction: z.string().max(3000),
  actor: z.string(),
  at: z.string(),
});
export const findingSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(160),
  kind: findingKind,
  explanation: z.string().min(1).max(2000),
  evidence: z.array(evidenceSchema).min(1).max(6),
  proposedBy: z.enum(["person", "agent"]),
  editedBy: z.string().optional(),
  editedAt: z.string().optional(),
  reviews: z.array(reviewSchema).max(200),
});
export const stateSchema = z.object({
  sources: z.array(sourceSchema).max(20),
  findings: z.array(findingSchema).max(80),
});
export const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  revision: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const exportSchema = z.object({
  id: z.string().uuid(),
  revision: z.number().int(),
  createdAt: z.string(),
  brief: z.string(),
  acknowledgment: z.string(),
  stale: z.boolean(),
});
export const projectViewSchema = projectSchema.extend({
  state: stateSchema,
  exports: z.array(exportSchema),
  canReview: z.boolean(),
});
export const revisionInput = z.object({
  id: z.string().uuid().describe("Project ID"),
  expectedRevision: z.coerce
    .number()
    .int()
    .min(1)
    .describe("Latest project revision; a stale revision is rejected"),
});
export const proposedFindingSchema = findingSchema.omit({
  id: true,
  proposedBy: true,
  editedBy: true,
  editedAt: true,
  reviews: true,
});
export type ProjectState = z.infer<typeof stateSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type ReviewInput = {
  findingId: string;
  outcome: z.infer<typeof outcome>;
  owner: string;
  rationale: string;
  direction: string;
};
export function latestReview(finding: Finding) {
  return finding.reviews[finding.reviews.length - 1];
}
export function effectiveOutcome(finding: Finding) {
  return latestReview(finding)?.outcome ?? "open";
}

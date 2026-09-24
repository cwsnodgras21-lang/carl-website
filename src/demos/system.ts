import type { SystemDiagram } from "@/content/types";

/**
 * System Designer — requirements in, the smallest system that satisfies
 * them out. Deterministic: every requirement adds one object and one rule,
 * in a fixed place in the chain. Not a generator; a way of thinking made
 * visible.
 */

export type RequirementId = "field" | "ownership" | "status" | "approvals" | "history" | "reporting";

export type Requirement = {
  id: RequirementId;
  label: string;
  /** The object the requirement adds to the system. */
  node: string;
  /** The rule the system enforces because of it. */
  rule: string;
  defaultOn: boolean;
};

export const today = ["Email", "Excel", "Teams"];

// Order is the order objects appear in the chain.
export const requirements: Requirement[] = [
  { id: "field", label: "Field access", node: "Field", rule: "Issues get logged where they happen, from the field.", defaultOn: true },
  { id: "ownership", label: "Ownership", node: "Owner", rule: "Every issue has exactly one owner.", defaultOn: true },
  { id: "status", label: "Status tracking", node: "Workflow", rule: "Status moves open → in progress → resolved. Nothing sits in an inbox.", defaultOn: true },
  { id: "approvals", label: "Approvals", node: "Approval", rule: "A resolution needs sign-off before the issue closes.", defaultOn: false },
  { id: "history", label: "Resolution history", node: "Resolution", rule: "Closing an issue records what fixed it.", defaultOn: true },
  { id: "reporting", label: "Reporting", node: "Reporting", rule: "Open issues by age and owner, without asking anyone.", defaultOn: false },
];

export const defaultSelection = requirements.filter((r) => r.defaultOn).map((r) => r.id);

const CORE = { id: "issue", label: "Issue", core: true };

/** The system for a set of requirements, as a left-to-right chain. */
export function designSystem(selected: RequirementId[]): {
  diagram: SystemDiagram;
  rules: string[];
} {
  const chosen = requirements.filter((r) => selected.includes(r.id));
  const intake = chosen.find((r) => r.id === "field");
  const after = chosen.filter((r) => r.id !== "field");

  // Without field access, issues still arrive through the old inbox.
  const first = intake ? { id: "field", label: intake.node } : { id: "inbox", label: "Inbox" };
  const nodes = [first, CORE, ...after.map((r) => ({ id: r.id, label: r.node }))];
  const edges = nodes.slice(1).map((n, i) => [nodes[i].id, n.id] as const);

  return {
    diagram: {
      title: "Issue tracking system designed from the selected requirements",
      columns: nodes.map((n) => [n]),
      edges,
    },
    rules: ["Every issue is one record, in one place.", ...chosen.map((r) => r.rule)],
  };
}

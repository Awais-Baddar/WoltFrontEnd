import { useMemo, useState } from "react";

type Task = { id: string; title: string; done: boolean; assignee?: "me" };
type Ticket = {
  id: string;
  customer: string;
  priority: "low" | "medium" | "high";
  issue: string;
  status: "open" | "resolved";
  assignedTo?: "me";
  createdAtISO: string;
  tasks: Task[];
};

const seed: Ticket[] = [
  {
    id: "T-1001",
    customer: "Anya",
    priority: "high",
    issue: "Late delivery — customer asking for ETA",
    status: "open",
    assignedTo: undefined,
    createdAtISO: new Date(Date.now() - 35 * 60_000).toISOString(),
    tasks: [
      { id: "a", title: "Check courier timeline", done: false },
      { id: "b", title: "Send apology + updated ETA", done: false },
    ],
  },
  {
    id: "T-1002",
    customer: "Mika",
    priority: "medium",
    issue: "Missing item — merchant packed fewer items",
    status: "open",
    assignedTo: undefined,
    createdAtISO: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
    tasks: [
      { id: "a", title: "Confirm merchant packing list", done: false },
      { id: "b", title: "Offer refund/credit options", done: false },
    ],
  },
  {
    id: "T-1003",
    customer: "Sara",
    priority: "low",
    issue: "Account login issue",
    status: "open",
    assignedTo: undefined,
    createdAtISO: new Date(Date.now() - 10 * 60_000).toISOString(),
    tasks: [
      { id: "a", title: "Verify account email", done: false },
      { id: "b", title: "Send reset instructions", done: false },
    ],
  },
];

function minsAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  return mins <= 0 ? "just now" : `${mins}m ago`;
}

export default function SupportDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>(seed);
  const [selectedId, setSelectedId] = useState(seed[0].id);

  const selected = useMemo(
    () => tickets.find((t) => t.id === selectedId)!,
    [tickets, selectedId],
  );

  function updateTicket(id: string, fn: (t: Ticket) => Ticket) {
    setTickets((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));
  }

  function pill(
    text: string,
    kind: "neutral" | "danger" | "warning" | "success",
  ) {
    const bg =
      kind === "danger"
        ? "#fef2f2"
        : kind === "warning"
          ? "#fffbeb"
          : kind === "success"
            ? "#f0fdf4"
            : "#f8fafc";

    const border =
      kind === "danger"
        ? "#fecaca"
        : kind === "warning"
          ? "#fde68a"
          : kind === "success"
            ? "#bbf7d0"
            : "#e2e8f0";

    const color =
      kind === "danger"
        ? "#991b1b"
        : kind === "warning"
          ? "#92400e"
          : kind === "success"
            ? "#166534"
            : "#334155";

    return (
      <span
        style={{
          fontSize: 12,
          padding: "3px 10px",
          borderRadius: 999,
          border: `1px solid ${border}`,
          background: bg,
          color,
          fontWeight: 700,
        }}
      >
        {text}
      </span>
    );
  }

  function actionButtonStyle(kind: "primary" | "danger" | "success") {
    const bg =
      kind === "primary"
        ? "#2563eb"
        : kind === "danger"
          ? "#dc2626"
          : "#16a34a";

    const hover =
      kind === "primary"
        ? "#1d4ed8"
        : kind === "danger"
          ? "#b91c1c"
          : "#15803d";

    return {
      background: bg,
      border: "1px solid rgba(0,0,0,0.08)",
      color: "white",
      fontWeight: 800 as const,
      boxShadow: "0 10px 22px rgba(15, 23, 42, 0.10)",
      transition: "transform 0.04s ease, background 0.12s ease",
      onMouseEnter: (e: any) => (e.currentTarget.style.background = hover),
      onMouseLeave: (e: any) => (e.currentTarget.style.background = bg),
    };
  }

  return (
    <div className="grid">
      {/* LEFT: Queue */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Support Ops Dashboard</h2>
        <p className="small">
          Ticket assignment workflow + task assignment/unassignment (internal
          tooling signal).
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginTop: 10,
          }}
        >
          <div className="callout">
            <div className="small">Open</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {tickets.filter((t) => t.status === "open").length}
            </div>
          </div>
          <div className="callout">
            <div className="small">Assigned to me</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {tickets.filter((t) => t.assignedTo).length}
            </div>
          </div>
          <div className="callout">
            <div className="small">Resolved</div>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
          </div>
        </div>

        {tickets.map((t) => {
          const isActive = t.id === selectedId;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              style={{
                width: "100%",
                textAlign: "left",
                marginTop: 8,
                borderColor: isActive ? "#111" : "#dcdcdc",
                background: isActive ? "#111" : "white",
                color: isActive ? "white" : "#111",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {t.id} — {t.customer}
                  </div>
                  <div
                    className="small"
                    style={{ color: isActive ? "#ddd" : "#666" }}
                  >
                    {t.issue}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="small"
                    style={{ color: isActive ? "#ddd" : "#666" }}
                  >
                    {minsAgo(t.createdAtISO)}
                  </div>
                  <div
                    className="small"
                    style={{ color: isActive ? "#ddd" : "#666" }}
                  >
                    {t.assignedTo ? "Assigned: me" : "Unassigned"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {t.priority === "high"
                  ? pill("Priority: high", "danger")
                  : t.priority === "medium"
                    ? pill("Priority: medium", "warning")
                    : pill("Priority: low", "neutral")}

                {t.status === "resolved"
                  ? pill("Status: resolved", "success")
                  : pill("Status: open", "warning")}

                {t.assignedTo
                  ? pill("Assigned", "neutral")
                  : pill("Unassigned", "neutral")}
              </div>
            </button>
          );
        })}
      </div>

      {/* RIGHT: Details */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>{selected.id}</h2>
            <div className="small">
              {selected.customer} — {selected.issue}
            </div>
            <div className="small">
              Created: {minsAgo(selected.createdAtISO)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {!selected.assignedTo ? (
              <button
                onClick={() =>
                  updateTicket(selected.id, (t) => ({ ...t, assignedTo: "me" }))
                }
                style={actionButtonStyle("primary")}
                onMouseEnter={actionButtonStyle("primary").onMouseEnter}
                onMouseLeave={actionButtonStyle("primary").onMouseLeave}
              >
                Assign to me
              </button>
            ) : (
              <button
                onClick={() =>
                  updateTicket(selected.id, (t) => ({
                    ...t,
                    assignedTo: undefined,
                  }))
                }
                style={actionButtonStyle("danger")}
                onMouseEnter={actionButtonStyle("danger").onMouseEnter}
                onMouseLeave={actionButtonStyle("danger").onMouseLeave}
              >
                Unassign
              </button>
            )}

            {selected.status !== "resolved" ? (
              <button
                onClick={() =>
                  updateTicket(selected.id, (t) => ({
                    ...t,
                    status: "resolved",
                  }))
                }
                style={actionButtonStyle("success")}
                onMouseEnter={actionButtonStyle("success").onMouseEnter}
                onMouseLeave={actionButtonStyle("success").onMouseLeave}
              >
                Mark resolved
              </button>
            ) : (
              <button
                onClick={() =>
                  updateTicket(selected.id, (t) => ({ ...t, status: "open" }))
                }
                style={actionButtonStyle("primary")}
                onMouseEnter={actionButtonStyle("primary").onMouseEnter}
                onMouseLeave={actionButtonStyle("primary").onMouseLeave}
              >
                Reopen
              </button>
            )}
          </div>
        </div>

        <hr />

        <h3 style={{ margin: "0 0 8px 0" }}>Tasks</h3>

        {selected.tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div>
              <label style={{ fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() =>
                    updateTicket(selected.id, (t) => ({
                      ...t,
                      tasks: t.tasks.map((x) =>
                        x.id === task.id ? { ...x, done: !x.done } : x,
                      ),
                    }))
                  }
                  style={{ marginRight: 10 }}
                />
                {task.title}
              </label>
              <div className="small">
                Assignee: {task.assignee ? "me" : "unassigned"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {!task.assignee ? (
                <button
                  onClick={() =>
                    updateTicket(selected.id, (t) => ({
                      ...t,
                      tasks: t.tasks.map((x) =>
                        x.id === task.id ? { ...x, assignee: "me" } : x,
                      ),
                    }))
                  }
                  style={actionButtonStyle("primary")}
                  onMouseEnter={actionButtonStyle("primary").onMouseEnter}
                  onMouseLeave={actionButtonStyle("primary").onMouseLeave}
                >
                  Assign
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateTicket(selected.id, (t) => ({
                      ...t,
                      tasks: t.tasks.map((x) =>
                        x.id === task.id ? { ...x, assignee: undefined } : x,
                      ),
                    }))
                  }
                  style={actionButtonStyle("danger")}
                  onMouseEnter={actionButtonStyle("danger").onMouseEnter}
                  onMouseLeave={actionButtonStyle("danger").onMouseLeave}
                >
                  Unassign
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="small" style={{ marginTop: 10 }}>
          Tip: this page is intentionally built like an internal tool
          (assignment workflows + operational clarity).
        </div>
      </div>
    </div>
  );
}

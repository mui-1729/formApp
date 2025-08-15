"use client";

import { useState } from "react";

interface Assignment {
  band_id: number;
  member_ids: number[];
}

export default function AdminPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCompute = async () => {
    setLoading(true);
    const res = await fetch("/api/live-assignments", { method: "POST" });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setAssignments(
        Object.entries(data.assignments).map(([bandId, memberIds]) => ({
          band_id: Number(bandId),
          member_ids: memberIds,
        }))
      );
    } else {
      const data = await res.json();
      alert("計算に失敗しました: " + data.error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ライブ出演バンド割り当て</h1>
      <button
        onClick={handleCompute}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? "計算中..." : "割り当て計算"}
      </button>

      <div className="mt-6">
        {assignments.map((a) => (
          <div key={a.band_id} className="mb-4">
            <h2 className="font-semibold">Band ID: {a.band_id}</h2>
            <p>Assigned Members: {a.member_ids.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Band {
  id: number;
  name: string;
}

export default function MemberPage() {
  const { data: session } = useSession();
  const [bands, setBands] = useState<Band[]>([]);
  const [priorities, setPriorities] = useState<Record<number, number>>({});

  useEffect(() => {
    // 仮データ: 後で API から取得も可能
    setBands([
      { id: 1, name: "Band A" },
      { id: 2, name: "Band B" },
      { id: 3, name: "Band C" },
    ]);
  }, []);

  const handleChange = (bandId: number, value: number) => {
    setPriorities((prev) => ({ ...prev, [bandId]: value }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;

    const payload = {
      memberId: session.user.id,
      priorities: Object.entries(priorities).map(([bandId, priority]) => ({
        bandId: Number(bandId),
        priority,
      })),
    };

    const res = await fetch("/api/member-priorities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("優先順位を保存しました！");
    } else {
      const data = await res.json();
      alert("保存に失敗しました: " + data.error);
    }
  };

  if (!session) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        ライブ出演希望バンドの優先順位
      </h1>
      <div className="flex flex-col gap-4">
        {bands.map((band) => (
          <div key={band.id} className="flex items-center gap-4">
            <span className="w-32">{band.name}</span>
            <input
              type="number"
              min={1}
              max={5}
              value={priorities[band.id] || ""}
              onChange={(e) => handleChange(band.id, Number(e.target.value))}
              className="border px-2 py-1 w-16"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        送信
      </button>
    </div>
  );
}

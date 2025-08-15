"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Band {
  id: number;
  name: string;
  averagePriority?: number;
}

interface MemberPriority {
  memberId: number;
  bandId: number;
  priority: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [bands, setBands] = useState<Band[]>([]);
  const [liveName, setLiveName] = useState("");
  const [liveSlots, setLiveSlots] = useState(3); // デフォルト3枠

  useEffect(() => {
    if (!session || session.user.role !== "admin") return;

    // 仮データ: 後で API から取得
    setBands([
      { id: 1, name: "Band A", averagePriority: 2 },
      { id: 2, name: "Band B", averagePriority: 1 },
      { id: 3, name: "Band C", averagePriority: 3 },
    ]);
  }, [session]);

  const handleSubmitLive = async () => {
    // 本来は API で保存
    alert(`ライブ "${liveName}" に ${liveSlots} 枠を設定しました`);
  };

  const handleDecideBands = async () => {
    // 本来はバンド平均優先度をもとに API で出演バンド決定
    alert("出演バンドを決定しました（仮）");
  };

  if (!session || session.user.role !== "admin")
    return <p>管理者のみアクセス可能です</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">ライブ枠設定</h2>
        <input
          type="text"
          placeholder="ライブ名"
          value={liveName}
          onChange={(e) => setLiveName(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="number"
          min={1}
          value={liveSlots}
          onChange={(e) => setLiveSlots(Number(e.target.value))}
          className="border px-2 py-1 w-20 mr-2"
        />
        <button
          onClick={handleSubmitLive}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          保存
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">バンド一覧（平均優先度）</h2>
        <ul className="mb-4">
          {bands.map((band) => (
            <li key={band.id}>
              {band.name} - 平均優先度: {band.averagePriority ?? "-"}
            </li>
          ))}
        </ul>
        <button
          onClick={handleDecideBands}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          出演バンドを決定
        </button>
      </section>
    </div>
  );
}

// src/pages/api/live-assignments.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 例: ライブ枠上限 2 バンド
    const MAX_BANDS = 2;

    // 全メンバーの優先順位を取得
    const { data: priorities, error } = await supabase
      .from("member_priorities")
      .select("*");

    if (error) throw error;

    // 簡易割り当てロジック：優先度が高い順に各バンドに割り当て
    const assignments: Record<number, number[]> = {}; // band_id => member_ids[]
    priorities.forEach((p: any) => {
      if (!assignments[p.band_id]) assignments[p.band_id] = [];
      if (assignments[p.band_id].length < MAX_BANDS) {
        assignments[p.band_id].push(p.member_id);
      }
    });

    // 結果を supabase に保存（例: table = live_assignments）
    const assignmentArray = Object.entries(assignments).flatMap(
      ([bandId, memberIds]) =>
        memberIds.map((memberId) => ({
          band_id: Number(bandId),
          member_id: memberId,
        }))
    );

    const { error: saveError } = await supabase
      .from("live_assignments")
      .upsert(assignmentArray);

    if (saveError) throw saveError;

    return res.status(200).json({ assignments });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

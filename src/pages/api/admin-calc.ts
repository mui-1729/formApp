// src/pages/api/admin-calc.ts
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
  try {
    const { data, error } = await supabase
      .from("member_priorities")
      .select("priority, member_id, band_id, members(name), bands(name)");

    if (error) throw error;

    // バンドごとの平均値を計算
    const bandMap: Record<
      string,
      { total: number; count: number; name: string }
    > = {};

    data.forEach((d: any) => {
      if (!bandMap[d.band_id]) {
        bandMap[d.band_id] = { total: 0, count: 0, name: d.bands.name };
      }
      bandMap[d.band_id].total += d.priority;
      bandMap[d.band_id].count += 1;
    });

    const result = Object.entries(bandMap).map(([band_id, val]) => ({
      band_id,
      band_name: val.name,
      average_priority: val.total / val.count,
    }));

    // 平均値が低い順にソート
    result.sort((a, b) => a.average_priority - b.average_priority);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

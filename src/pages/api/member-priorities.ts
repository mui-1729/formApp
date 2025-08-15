// src/pages/api/member-priorities.ts
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
    const { memberId, priorities } = req.body;

    if (!memberId || !priorities) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // 優先順位を supabase のテーブルに保存
    // 例: table = 'member_priorities', columns = member_id, band_id, priority
    const { error } = await supabase.from("member_priorities").upsert(
      priorities.map((p: { bandId: number; priority: number }) => ({
        member_id: memberId,
        band_id: p.bandId,
        priority: p.priority,
      }))
    );

    if (error) throw error;

    return res.status(200).json({ message: "保存成功" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}

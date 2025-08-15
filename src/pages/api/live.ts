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
  if (req.method === "POST") {
    const { liveName, slots } = req.body;

    // 仮: 保存処理
    console.log("Live settings:", liveName, slots);

    return res.status(200).json({ message: "ライブ枠保存完了（仮）" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

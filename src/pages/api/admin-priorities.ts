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
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("member_priorities")
        .select(
          `
          member_id,
          priority,
          band_id,
          members(name),
          bands(name)
        `
        )
        .order("priority", { ascending: true });

      if (error) throw error;

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

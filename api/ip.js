import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const time = new Date().toISOString();

    const result = await supabase
      .from('visitors')
      .insert([{ ip, created_at: time }])
      .select();

    return res.status(200).json({
      ok: true,
      ip,
      time,
      supabaseResult: result
    });

  } catch (err) {
    console.log("CRASH ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || err
    });
  }
}

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const time = new Date().toISOString();

  const result = await supabase
    .from('visitors')
    .insert([{ ip, created_at: time }])
    .select(); // 🔥 這行很重要（讓它回傳結果）

  res.status(200).json({
    ip,
    time,
    supabaseResult: result
  });
}

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const time = new Date().toISOString();

    const { data, error } = await supabase
      .from('visitors')
      .upsert(
        [
          {
            ip,
            created_at: time,
            last_seen: time
          }
        ],
        {
          onConflict: 'ip'
        }
      )
      .select();

    return res.status(200).json({
      ok: true,
      ip,
      time,
      inserted: data,
      error
    });

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: e.message
    });
  }
}

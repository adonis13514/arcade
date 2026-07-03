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

    // 🔥 這行超重要：讓你看得到錯誤
    if (error) {
      return res.status(500).json({
        ok: false,
        step: "supabase_error",
        error
      });
    }

    return res.status(200).json({
      ok: true,
      ip,
      time,
      inserted: data
    });

  } catch (e) {
    return res.status(500).json({
      ok: false,
      step: "crash",
      error: e.message
    });
  }
}

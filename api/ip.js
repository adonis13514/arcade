import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const time = new Date().toISOString();

  await supabase.from('visitors').insert([
    { ip, created_at: time }
  ]);

  res.status(200).json({ ip, time });
}

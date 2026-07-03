import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  return res.status(200).json({
    env_check: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY ? "exists" : "missing"
    }
  })
}

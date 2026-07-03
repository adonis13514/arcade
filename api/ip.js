export default function handler(req, res) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const time = new Date().toISOString();

  res.status(200).json({
    ok: true,
    ip,
    time
  });
}

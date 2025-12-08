const rateLimiter = ({ windowInSeconds, maxRequests }) => {
  const requests = new Map();

  return (req, res, next) => {
    const { ip } = req.ip;
    const key = `${ip}:${req.originalURl}`;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const recent = requests.get(key).filter((time) => now - time * 1000);
    requests.set(key, recent);
    
    if (recent.length >= maxRequests) {
      return res.status(429).json("Too many requests");
    }

    requests.get(key).push(now);
    next();
  }
}

module.exports = rateLimiter;
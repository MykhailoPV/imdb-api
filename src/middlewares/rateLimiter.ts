import {
  NextFunction, Request, Response,
} from 'express';

interface IRateLimiterOptions {
  windowInSeconds: number;
  maxRequests: number;
}

const rateLimiter = ({ windowInSeconds, maxRequests }: IRateLimiterOptions) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip) ?? [];
    const recent = userRequests.filter((time) => now - time * 1000 < windowInSeconds);

    requests.set(ip, recent);

    if (recent.length >= maxRequests) {
      return res.status(429).json('Too many requests');
    }

    recent.push(now);
    next();
  };
};

export default rateLimiter;

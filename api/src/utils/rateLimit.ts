// GhostInTheHash | "SIGNAL IN. SHADOW OUT." — Harsh Pardeshi
import type { Request, Response, NextFunction } from "express";

type HitWindow = {
  hits: number[];
};

const buckets = new Map<string, HitWindow>();

export const createRateLimit = (max: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key) ?? { hits: [] };

    bucket.hits = bucket.hits.filter((timestamp) => now - timestamp < windowMs);

    if (bucket.hits.length >= max) {
      res.status(429).json({
        message: "Too many simulation requests. Try again later.",
      });
      return;
    }

    bucket.hits.push(now);
    buckets.set(key, bucket);
    next();
  };
};

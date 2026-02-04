/**
 * 🔒 Rate Limiting Utility
 * ป้องกัน DDoS, brute force attacks, และ spam
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

class RateLimiter {
  private requestCounts: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      ...config
    };
  }

  /**
   * ตรวจสอบว่าถูก rate limit หรือไม่
   * @param key - Unique identifier (e.g., IP address, user ID, email)
   * @returns boolean - true if allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // ดึง timestamps สำหรับ key นี้
    let timestamps = this.requestCounts.get(key) || [];

    // ลบ timestamps ที่เก่า (นอกหน้าต่าง time window)
    timestamps = timestamps.filter(timestamp => timestamp > windowStart);

    // ตรวจสอบว่าเกิน limit หรือไม่
    if (timestamps.length >= this.config.maxRequests) {
      return false;
    }

    // เพิ่ม timestamp ปัจจุบัน
    timestamps.push(now);
    this.requestCounts.set(key, timestamps);

    return true;
  }

  /**
   * รีเซ็ต rate limiter สำหรับ key
   * @param key - Key to reset
   */
  reset(key: string): void {
    this.requestCounts.delete(key);
  }

  /**
   * ล้าง rate limiter ทั้งหมด (ใช้ใน cleanup)
   */
  clear(): void {
    this.requestCounts.clear();
  }

  /**
   * ดึงจำนวน requests ที่เหลือในหน้าต่าง
   * @param key - Key to check
   * @returns number - Remaining requests
   */
  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const timestamps = (this.requestCounts.get(key) || []).filter(
      timestamp => timestamp > windowStart
    );
    return Math.max(0, this.config.maxRequests - timestamps.length);
  }

  /**
   * ดึงเวลาคงเหลือจนกว่า rate limit จะหมด
   * @param key - Key to check
   * @returns number - Milliseconds until reset
   */
  getResetTime(key: string): number {
    const timestamps = this.requestCounts.get(key) || [];
    if (timestamps.length === 0) return 0;

    const oldestTimestamp = Math.min(...timestamps);
    const resetTime = oldestTimestamp + this.config.windowMs - Date.now();
    return Math.max(0, resetTime);
  }
}

// ✅ สร้าง instances สำหรับ use cases ต่างๆ
export const rateLimiters = {
  // ป้องกัน login brute force - 5 attempts per 15 minutes
  login: new RateLimiter({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000
  }),

  // ป้องกัน case tracking queries - 10 queries per minute
  caseTracking: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000
  }),

  // ป้องกัน contact form submission - 5 per hour
  contactForm: new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 60 * 1000
  }),

  // ป้องกัน file uploads - 10 per hour
  fileUpload: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 60 * 1000
  }),

  // ป้องกัน AI generation - 5 per hour (expensive operation)
  aiGeneration: new RateLimiter({
    maxRequests: 5,
    windowMs: 60 * 60 * 1000
  }),

  // ป้องกัน API calls - 30 per minute (general API)
  api: new RateLimiter({
    maxRequests: 30,
    windowMs: 60 * 1000
  })
};

export default RateLimiter;

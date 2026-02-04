/**
 * 🔒 Input Validation & Sanitization Utility
 * ป้องกัน Injection Attacks, XSS, และ NoSQL Injection
 */

export const validation = {
  /**
   * ตรวจสอบเบอร์โทรศัพท์ (Thailand format)
   * @param phone - เบอร์โทร
   * @returns boolean - ถ้า valid return true
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  },

  /**
   * ตรวจสอบ Email
   * @param email - Email address
   * @returns boolean
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * ตรวจสอบความยาวข้อความ
   * @param text - Text to validate
   * @param minLength - Minimum length
   * @param maxLength - Maximum length
   * @returns boolean
   */
  isValidTextLength(
    text: string,
    minLength: number = 1,
    maxLength: number = 5000
  ): boolean {
    return text && text.length >= minLength && text.length <= maxLength;
  },

  /**
   * ตรวจสอบ URL (ป้องกัน arbitrary URLs)
   * @param url - URL to validate
   * @returns boolean
   */
  isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // Only allow http/https protocols
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * ทำความสะอาด HTML/Script injection
   * @param text - Text that might contain HTML
   * @returns string - Sanitized text
   */
  sanitizeText(text: string): string {
    // Remove dangerous characters while preserving safe ones
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * ตรวจสอบ Base64 format
   * @param base64String - String to check
   * @returns boolean
   */
  isValidBase64(base64String: string): boolean {
    const base64Regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,([a-zA-Z0-9+/=])+$/;
    return base64Regex.test(base64String);
  },

  /**
   * ตรวจสอบขนาดไฟล์
   * @param fileSize - File size in bytes
   * @param maxSizeMB - Maximum size in MB
   * @returns boolean
   */
  isValidFileSize(fileSize: number, maxSizeMB: number = 50): boolean {
    return fileSize <= maxSizeMB * 1024 * 1024;
  },

  /**
   * ตรวจสอบ MIME type ของไฟล์
   * @param mimeType - MIME type
   * @param allowedTypes - Array of allowed MIME types
   * @returns boolean
   */
  isValidMimeType(
    mimeType: string,
    allowedTypes: string[] = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword'
    ]
  ): boolean {
    return allowedTypes.includes(mimeType);
  },

  /**
   * ทำความสะอาด object เพื่อป้องกัน NoSQL Injection
   * @param obj - Object to clean
   * @returns Cleaned object
   */
  sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const cleaned = { ...obj };
    
    for (const key in cleaned) {
      // ป้องกัน prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        delete cleaned[key];
        continue;
      }

      const value = cleaned[key];
      
      // Clean string values
      if (typeof value === 'string') {
        cleaned[key] = this.sanitizeText(value);
      }
      
      // Recursively clean nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        cleaned[key] = this.sanitizeObject(value);
      }
    }
    
    return cleaned;
  },

  /**
   * ตรวจสอบว่าข้อมูลเป็น valid lead data
   * @param data - Lead data to validate
   * @returns boolean
   */
  isValidLead(data: any): boolean {
    return (
      typeof data.name === 'string' &&
      this.isValidPhone(data.phone) &&
      this.isValidEmail(data.email) &&
      this.isValidTextLength(data.details, 0, 2000)
    );
  },

  /**
   * ตรวจสอบ password strength
   * @param password - Password to check
   * @returns boolean
   */
  isStrongPassword(password: string): boolean {
    // Require: at least 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return passwordRegex.test(password);
  }
};

export default validation;

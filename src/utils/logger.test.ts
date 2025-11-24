import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logError, logWarn, logInfo } from './logger';
import type { LogContext } from '../types/logger';

describe('Logger Utility', () => {
  // Mock console methods
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('logError', () => {
    it('should log error with structured JSON format', () => {
      const context: LogContext = {
        action: 'test_action',
        errorCode: 'TEST_ERROR',
      };

      logError('Test error message', context, '/api/test');

      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed).toMatchObject({
        level: 'ERROR',
        message: 'Test error message',
        endpoint: '/api/test',
        error_type: 'system_error',
        context: {
          action: 'test_action',
          errorCode: 'TEST_ERROR',
        },
      });

      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('requestId');
      expect(parsed).toHaveProperty('environment');
    });

    it('should sanitize email addresses from message', () => {
      logError('User test@example.com failed to submit', {}, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.message).toBe('User [EMAIL] failed to submit');
    });

    it('should sanitize API keys from message', () => {
      logError('API key sk_test_FakeKeyForTestingPurposes123 leaked', {}, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.message).toBe('API key sk_test_[REDACTED] leaked');
    });

    it('should sanitize Resend API keys', () => {
      logError('Resend key re_12345678901234567890 exposed', {}, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.message).toBe('Resend key re_[REDACTED] exposed');
    });

    it('should sanitize phone numbers from message', () => {
      logError('Contact +1-555-123-4567 for support', {}, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.message).toBe('Contact [PHONE] for support');
    });

    it('should sanitize passwords from query strings', () => {
      logError('Failed login: password=secret123', {}, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.message).toBe('Failed login: password=[REDACTED]');
    });

    it('should redact sensitive context keys', () => {
      const context: LogContext = {
        email: 'user@example.com',
        password: 'secret123',
        apiKey: 'sk_test_abc',
        normalField: 'visible',
      };

      logError('Test message', context, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.context).toMatchObject({
        email: '[REDACTED]',
        password: '[REDACTED]',
        apiKey: '[REDACTED]',
        normalField: 'visible',
      });
    });

    it('should sanitize string arrays in context', () => {
      const context: LogContext = {
        validationErrors: [
          'Email test@example.com is invalid',
          'Phone +1-555-123-4567 is too short',
        ],
      };

      logError('Validation failed', context, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.context.validationErrors).toEqual([
        'Email [EMAIL] is invalid',
        'Phone [PHONE] is too short',
      ]);
    });

    it('should truncate long messages to 500 chars', () => {
      const longMessage = 'A'.repeat(600);

      logError(longMessage, {}, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(loggedMessage);

      expect(parsed.message).toHaveLength(500);
      expect(parsed.message).toMatch(/\.\.\.$/);
    });

    it('should truncate large context objects', () => {
      const largeContext: LogContext = {
        bigArray: Array(1000).fill('x'.repeat(100)),
      };

      logError('Test', largeContext, '/api/test');

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage.length).toBeLessThan(2000); // Should be truncated
    });

    it('should infer db_error type from message', () => {
      logError('Database connection failed', {}, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.error_type).toBe('db_error');
    });

    it('should infer email_error type from message', () => {
      logError('Failed to send email via Resend', {}, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.error_type).toBe('email_error');
    });

    it('should infer validation_error type from message', () => {
      logError('Invalid request body', {}, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.error_type).toBe('validation_error');
    });

    it('should infer config_error from context', () => {
      logError('Missing environment variable', { missingVar: 'API_KEY' }, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.error_type).toBe('config_error');
    });

    it('should default endpoint to "unknown" if not provided', () => {
      logError('Test', {});

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.endpoint).toBe('unknown');
    });

    it('should handle circular references in context', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;

      // Should not throw
      expect(() => {
        logError('Test circular', circular, '/api/test');
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('logWarn', () => {
    it('should log warning with WARN level', () => {
      logWarn('Test warning', { action: 'test' }, '/api/test');

      expect(consoleWarnSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(consoleWarnSpy.mock.calls[0][0]);

      expect(parsed.level).toBe('WARN');
      expect(parsed.message).toBe('Test warning');
    });

    it('should sanitize sensitive data in warnings', () => {
      logWarn('Rate limit for test@example.com', {}, '/api/test');

      const parsed = JSON.parse(consoleWarnSpy.mock.calls[0][0]);
      expect(parsed.message).toBe('Rate limit for [EMAIL]');
    });
  });

  describe('logInfo', () => {
    it('should log info with INFO level', () => {
      logInfo('Cold start completed', { duration: 1 }, '/api/test');

      expect(consoleLogSpy).toHaveBeenCalledOnce();
      const parsed = JSON.parse(consoleLogSpy.mock.calls[0][0]);

      expect(parsed.level).toBe('INFO');
      expect(parsed.message).toBe('Cold start completed');
    });

    it('should infer cold_start error type', () => {
      logInfo('Cold start: environment validated', {}, '/api/test');

      const parsed = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(parsed.error_type).toBe('cold_start');
    });
  });

  describe('Context Truncation', () => {
    it('should remove optional fields first when truncating', () => {
      const context: LogContext = {
        action: 'test',
        duration: 1000,
        retryAttempt: 3,
        essential: 'keep',
        bigData: 'x'.repeat(2000),
      };

      logError('Test', context, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      // Should keep essential fields
      expect(parsed.context).toHaveProperty('action');
      expect(parsed.context).toHaveProperty('essential');
    });

    it('should truncate large arrays when context exceeds size limit', () => {
      // Create context that exceeds 1KB limit
      const context: LogContext = {
        errors: Array(20).fill('x'.repeat(100)), // ~2KB total
      };

      logError('Multiple errors', context, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      // Array should be truncated to 5 items or have truncation marker
      if (Array.isArray(parsed.context.errors)) {
        expect(parsed.context.errors.length).toBeLessThanOrEqual(5);
      } else {
        // Context was truncated completely
        expect(parsed.context._truncated).toBe(true);
      }
    });

    it('should add truncation marker for very large contexts', () => {
      const context: LogContext = {
        data1: 'x'.repeat(500),
        data2: 'y'.repeat(500),
        data3: 'z'.repeat(500),
      };

      logError('Test', context, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      // Should be truncated or have marker
      expect(
        parsed.context._truncated === true || Object.keys(parsed.context).length < 3
      ).toBe(true);
    });
  });

  describe('Environment Handling', () => {
    it('should include environment from NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';

      logError('Test', {}, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.environment).toBe('test');

      process.env.NODE_ENV = originalEnv;
    });

    it('should default to production if NODE_ENV not set', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      logError('Test', {}, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(parsed.environment).toBe('production');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Request ID Generation', () => {
    it('should generate unique request IDs for each log', () => {
      logError('Test 1', {}, '/api/test');
      logError('Test 2', {}, '/api/test');

      const parsed1 = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      const parsed2 = JSON.parse(consoleErrorSpy.mock.calls[1][0]);

      expect(parsed1.requestId).toBeDefined();
      expect(parsed2.requestId).toBeDefined();
      expect(parsed1.requestId).not.toBe(parsed2.requestId);
    });

    it('should generate valid UUID v4 format', () => {
      logError('Test', {}, '/api/test');

      const parsed = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(parsed.requestId).toMatch(uuidRegex);
    });
  });
});

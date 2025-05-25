const { validateUser } = require('../../src/utils/validation');

describe('User Validation', () => {
    it('should pass with valid data', () => {
        const data = { name: 'John Doe', email: 'john@example.com' };
        const result = validateUser(data);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('should fail when name is missing', () => {
        const data = { email: 'john@example.com' };
        const result = validateUser(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Name is required');
    });

    it('should fail when email is missing', () => {
        const data = { name: 'John Doe' };
        const result = validateUser(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email is required');
    });

    it('should fail with invalid email format', () => {
        const data = { name: 'John Doe', email: 'not-an-email' };
        const result = validateUser(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid email format');
    });

    it('should fail when name exceeds max length', () => {
        const longName = 'A'.repeat(101);
        const data = { name: longName, email: 'test@example.com' };
        const result = validateUser(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Name must be 100 characters or less');
    });

    it('should fail when name contains invalid characters', () => {
        const data = { name: 'John123', email: 'test@example.com' };
        const result = validateUser(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Name contains invalid characters');
    });

    it('should fail when email exceeds max length', () => {
        const longEmail = 'a'.repeat(91) + '@example.com'; // total 101 chars
        const data = { name: 'John Doe', email: longEmail };
        const result = validateUser(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email must be 100 characters or less');
    });
});

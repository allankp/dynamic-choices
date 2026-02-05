import { describe, it, expect } from 'vitest';
import { validateInputs, type ActionInputs } from '../inputs';

describe('validateInputs', () => {
  const validInputs: ActionInputs = {
    action: 'add',
    inputName: 'environment',
    workflows: ['deploy.yml'],
    choiceValue: 'staging',
  };

  describe('action validation', () => {
    it('should accept valid actions', () => {
      expect(validateInputs({ ...validInputs, action: 'add' })).toEqual({ valid: true });
      expect(validateInputs({ ...validInputs, action: 'update', newChoiceValue: 'new' })).toEqual({
        valid: true,
      });
      expect(validateInputs({ ...validInputs, action: 'delete' })).toEqual({ valid: true });
    });

    it('should reject invalid actions', () => {
      const result = validateInputs({
        ...validInputs,
        action: 'invalid' as ActionInputs['action'],
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid action');
    });
  });

  describe('input name validation', () => {
    it('should reject empty input name', () => {
      const result = validateInputs({ ...validInputs, inputName: '' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Input name cannot be empty');
    });

    it('should reject whitespace-only input name', () => {
      const result = validateInputs({ ...validInputs, inputName: '   ' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Input name cannot be empty');
    });
  });

  describe('workflows validation', () => {
    it('should reject empty workflows array', () => {
      const result = validateInputs({ ...validInputs, workflows: [] });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('At least one workflow must be specified');
    });

    it('should accept valid workflow file names', () => {
      const result = validateInputs({ ...validInputs, workflows: ['deploy.yml', 'release.yaml'] });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid workflow file names', () => {
      const result = validateInputs({ ...validInputs, workflows: ['deploy.txt'] });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid workflow file');
    });
  });

  describe('choice value validation', () => {
    it('should reject empty choice value', () => {
      const result = validateInputs({ ...validInputs, choiceValue: '' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Choice value cannot be empty');
    });
  });

  describe('update action validation', () => {
    it('should require new-choice-value for update action', () => {
      const result = validateInputs({ ...validInputs, action: 'update' });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('new-choice-value is required');
    });

    it('should accept update action with new-choice-value', () => {
      const result = validateInputs({
        ...validInputs,
        action: 'update',
        newChoiceValue: 'new-value',
      });
      expect(result.valid).toBe(true);
    });
  });
});

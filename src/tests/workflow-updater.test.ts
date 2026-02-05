import { describe, it, expect } from 'vitest';
import { modifyWorkflowContent } from '../workflow-updater';

describe('modifyWorkflowContent', () => {
  const sampleWorkflow = `name: Deploy
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
`;

  describe('add action', () => {
    it('should add a new choice to options', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'add',
        inputName: 'environment',
        choiceValue: 'testing',
      });

      expect(result).toContain('testing');
      expect(result).toContain('development');
      expect(result).toContain('staging');
      expect(result).toContain('production');
    });

    it('should not duplicate existing choice', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'add',
        inputName: 'environment',
        choiceValue: 'staging',
      });

      // Count occurrences of 'staging'
      const matches = result.match(/staging/g);
      expect(matches?.length).toBe(1);
    });
  });

  describe('delete action', () => {
    it('should remove an existing choice', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'delete',
        inputName: 'environment',
        choiceValue: 'staging',
      });

      expect(result).not.toContain('staging');
      expect(result).toContain('development');
      expect(result).toContain('production');
    });

    it('should not modify if choice does not exist', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'delete',
        inputName: 'environment',
        choiceValue: 'nonexistent',
      });

      expect(result).toBe(sampleWorkflow);
    });
  });

  describe('update action', () => {
    it('should update an existing choice', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'update',
        inputName: 'environment',
        choiceValue: 'staging',
        newChoiceValue: 'stage',
      });

      expect(result).not.toContain('staging');
      expect(result).toContain('stage');
      expect(result).toContain('development');
      expect(result).toContain('production');
    });

    it('should not modify if choice does not exist', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'update',
        inputName: 'environment',
        choiceValue: 'nonexistent',
        newChoiceValue: 'new-value',
      });

      expect(result).toBe(sampleWorkflow);
    });
  });

  describe('edge cases', () => {
    it('should return original content if input not found', () => {
      const result = modifyWorkflowContent(sampleWorkflow, {
        action: 'add',
        inputName: 'nonexistent-input',
        choiceValue: 'value',
      });

      expect(result).toBe(sampleWorkflow);
    });

    it('should handle workflow without workflow_dispatch', () => {
      const noDispatchWorkflow = `name: CI
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
`;

      const result = modifyWorkflowContent(noDispatchWorkflow, {
        action: 'add',
        inputName: 'environment',
        choiceValue: 'value',
      });

      expect(result).toBe(noDispatchWorkflow);
    });

    it('should handle input that is not a choice type', () => {
      const stringInputWorkflow = `name: Deploy
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true
        type: string
`;

      const result = modifyWorkflowContent(stringInputWorkflow, {
        action: 'add',
        inputName: 'version',
        choiceValue: 'v1.0.0',
      });

      expect(result).toBe(stringInputWorkflow);
    });

    it('should handle workflow with GitHub expression syntax', () => {
      const workflowWithExpressions = `name: Deploy
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Show env
        run: echo "Deploying to \${{ inputs.environment }}"
`;

      const result = modifyWorkflowContent(workflowWithExpressions, {
        action: 'add',
        inputName: 'environment',
        choiceValue: 'testing',
      });

      expect(result).toContain('testing');
      expect(result).toContain('development');
      expect(result).toContain('staging');
      expect(result).toContain('production');
    });
  });
});

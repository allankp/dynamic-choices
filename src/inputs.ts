export type ActionType = 'add' | 'update' | 'delete';

export interface ActionInputs {
  action: ActionType;
  inputName: string;
  workflows: string[];
  choiceValue: string;
  newChoiceValue?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const VALID_ACTIONS: ActionType[] = ['add', 'update', 'delete'];

export function validateInputs(inputs: ActionInputs): ValidationResult {
  // Validate action type
  if (!VALID_ACTIONS.includes(inputs.action)) {
    return {
      valid: false,
      error: `Invalid action "${inputs.action}". Must be one of: ${VALID_ACTIONS.join(', ')}`,
    };
  }

  // Validate input name
  if (!inputs.inputName || inputs.inputName.trim().length === 0) {
    return {
      valid: false,
      error: 'Input name cannot be empty',
    };
  }

  // Validate workflows
  if (!inputs.workflows || inputs.workflows.length === 0) {
    return {
      valid: false,
      error: 'At least one workflow must be specified',
    };
  }

  // Validate workflow file names
  for (const workflow of inputs.workflows) {
    if (!workflow.endsWith('.yml') && !workflow.endsWith('.yaml')) {
      return {
        valid: false,
        error: `Invalid workflow file "${workflow}". Must end with .yml or .yaml`,
      };
    }
  }

  // Validate choice value
  if (!inputs.choiceValue || inputs.choiceValue.trim().length === 0) {
    return {
      valid: false,
      error: 'Choice value cannot be empty',
    };
  }

  // Validate new-choice-value for update action
  if (inputs.action === 'update') {
    if (!inputs.newChoiceValue || inputs.newChoiceValue.trim().length === 0) {
      return {
        valid: false,
        error: 'new-choice-value is required when action is "update"',
      };
    }
  }

  return { valid: true };
}

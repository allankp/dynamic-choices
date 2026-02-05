import * as core from '@actions/core';
import * as github from '@actions/github';
import { updateWorkflowChoices } from './workflow-updater';
import { ActionType, validateInputs } from './inputs';

async function run(): Promise<void> {
  try {
    const action = core.getInput('action', { required: true }).toLowerCase() as ActionType;
    const inputName = core.getInput('input-name', { required: true });
    const workflowsInput = core.getInput('workflows', { required: true });
    const choiceValue = core.getInput('choice-value', { required: true });
    const newChoiceValue = core.getInput('new-choice-value');
    const token = core.getInput('github-token', { required: true });
    const commitMessage = core.getInput('commit-message');
    const branch = core.getInput('branch');

    // Parse workflows list
    const workflows = workflowsInput
      .split(',')
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    // Validate inputs
    const validation = validateInputs({
      action,
      inputName,
      workflows,
      choiceValue,
      newChoiceValue,
    });

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const octokit = github.getOctokit(token);
    const context = github.context;

    core.info(`Action: ${action}`);
    core.info(`Input name: ${inputName}`);
    core.info(`Workflows: ${workflows.join(', ')}`);
    core.info(`Choice value: ${choiceValue}`);
    if (newChoiceValue) {
      core.info(`New choice value: ${newChoiceValue}`);
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const result = await updateWorkflowChoices({
      octokit,
      owner: context.repo.owner,
      repo: context.repo.repo,
      action,
      inputName,
      workflows,
      choiceValue,
      newChoiceValue,
      commitMessage,
      branch,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    core.setOutput('updated-workflows', result.updatedWorkflows.join(','));
    core.setOutput('changes-made', result.changesMade.toString());

    if (result.changesMade) {
      core.info(`Successfully updated ${result.updatedWorkflows.length} workflow(s)`);
    } else {
      core.info('No changes were necessary');
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

void run();

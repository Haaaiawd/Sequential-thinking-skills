import type { SessionState, StepRecord, StepPolicy } from '../types/session.js';

export function formatStartOutput(session: SessionState, nextStepPolicy: StepPolicy): string {
  return [
    `session: ${session.name}`,
    `goal: ${session.goal}`,
    `mode: ${session.mode}`,
    `totalSteps: ${session.totalSteps}`,
    `shouldConverge: ${String(nextStepPolicy.shouldConverge)}`,
    `mustConclude: ${String(nextStepPolicy.mustConclude)}`,
    `storagePath: ${session.storagePath}`
  ].join('\n');
}

export function formatStepOutput(session: SessionState, step: StepRecord): string {
  return [
    `session: ${session.name}`,
    `step: ${step.stepNumber}/${session.totalSteps}`,
    `mode: ${step.mode}`,
    `shouldConverge: ${String(step.shouldConverge)}`,
    `mustConclude: ${String(step.mustConclude)}`,
    `status: ${session.status}`
  ].join('\n');
}

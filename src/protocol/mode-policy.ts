import type { SessionMode, StepPolicy, TotalSteps } from '../types/session.js';

function getConvergeStart(totalSteps: TotalSteps): number {
  return totalSteps === 5 ? 4 : 6;
}

export function getStepPolicy(mode: SessionMode, stepNumber: number, totalSteps: TotalSteps): StepPolicy {
  if (stepNumber < 1 || stepNumber > totalSteps) {
    throw new Error(`stepNumber must be between 1 and ${totalSteps}`);
  }

  const convergeStart = getConvergeStart(totalSteps);
  const mustConclude = stepNumber === totalSteps;
  const shouldConverge = stepNumber >= convergeStart;

  if (mustConclude) {
    return {
      shouldConverge: true,
      mustConclude: true
    };
  }

  if (shouldConverge) {
    return {
      shouldConverge: true,
      mustConclude: false
    };
  }

  return {
    shouldConverge: false,
    mustConclude: false
  };
}

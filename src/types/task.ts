export type TaskRFC = {
  id: string;
  priority: string;
  priorityRequirement: string;
  isBigClient: boolean;
  clientEnvironment: string;
  useCaseImpact: string;
  description: string;
  workDescription: string;
  clientName: string;
  clientRole: string;
  reason: string;
  goal: string;
  requirement: string;
}

export type TaskBugfix = {
  id: string;
  reportBy: string;
  dateReported: string;
  module: string;
  description: string;
  severity: string;
  severityEffect: string;
  priority: string;
  preCondition: string;
  stepToProduce: string;
  expectedResult: string;
  actualResult: string;
  medias: string[];
  additionalInformation: string;
}

export type TaskRFC = {
  id: string;
  priority: string;
  priorityRequirement: string;
  isBigClient: string;
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
  dateReported: Date;
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

export type TaskBugfixData ={
  reportBy?: string;
  dateReported?: Date;
  module?: string;
  description?: string;
  severity?: string;
  severityEffect?: string;
  priority?: string;
  preCondition?: string;
  stepToProduce?: string;
  expectedResult?: string;
  actualResult?: string;
  medias?: string[];
  additionalInformation?: string;
}

export type TaskRFCData ={
  priority?: string;
  priorityRequirement?: string;
  isBigClient?: string;
  clientEnvironment?: string;
  useCaseImpact?: string;
  description?: string;
  workDescription?: string;
  clientName?: string;
  clientRole?: string;
  reason?: string;
  goal?: string;
  requirement?: string;
}

export type TaskLinear ={
  title: string;
  description: string;
  priority: number;
}

export type TaskLine ={
  feedback_id: string;
  title: string;
  description: string;
}

export type INSERT_TASK_MUTATION = {
	insert_task_one: TaskLine;
};

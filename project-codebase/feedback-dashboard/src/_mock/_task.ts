
export const TASK_CLIENT_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];


export const TASK_USE_CASE_IMPACT_OPTIONS = [
  { value: 'Only this environment', label: 'Only this environment' },
  {
    value: 'All environments (all OpusFlow users)',
    label: 'All environments (all OpusFlow users)',
  },
];


export const TASK_PRIORITIES = [
  {
    label: 'High',
    value: 'high',
    options: [
      { label: 'Unworkable process', value: 'Unworkable process' },
      { label: 'Onboarding client', value: 'Onboarding client' },
      { label: 'Prevention of churn', value: 'Prevention of churn' },
      { label: 'Overdue promise', value: 'Overdue promise' },
      { label: 'Other', value: 'Other' },
    ],
  },
  {
    label: 'Medium',
    value: 'medium',
    options: [
      { label: 'Not immediately required', value: 'Not immediately required' },
      {
        label: 'Can currently be fixed through other means',
        value: 'Can currently be fixed through other means',
      },
      { label: 'Feedback on UX- or UI flow', value: 'Feedback on UX- or UI flow' },
      { label: 'Other', value: 'Other' },
    ],
  },
  {
    label: 'Low',
    value: 'low',
    options: [
      { label: 'Nice to have', value: 'Nice to have' },
      { label: 'Other', value: 'Other' },
    ],
  },
];


export const TASK_SEVERITY_EFFECT_OPTIONS = [
  { value: 'All users or environments.', label: 'All users or environments.' },
  {
    value: "Only one or a few customers' environments or users specify which Environment or user",
    label: 'Only one or a few customers environments or users specify which Environment or user',
  },
];

export const TASK_MODULES_OPTIONS = [
  { value: 'My environment', label: 'My environment' },
  { value: 'Planning', label: 'Planning' },
  { value: 'CRM', label: 'CRM' },
  { value: 'Forms', label: 'Forms' },
  { value: 'Administration', label: 'Administration' },
  { value: 'Stock', label: 'Stock' },
  { value: 'Management', label: 'Management' },
  { value: 'Project', label: 'Project' },
  { value: 'Other', label: 'Other' },
];

export const TASK_PRIORITY_OPTIONS = [
  { label: 'Urgent', value: 'Urgent' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

export const TASK_SEVERITY_OPTIONS = [
  { label: 'Critical', value: 'Critical' },
  { label: 'Major', value: 'Major' },
  { label: 'Minor', value: 'Minor' },
  { label: 'Trivial', value: 'Trivial' },
];

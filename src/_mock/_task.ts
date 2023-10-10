
export const TASK_CLIENT_OPTIONS = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
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

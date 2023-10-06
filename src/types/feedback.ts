
// ----------------------------------------------------------------------

export type FeedbackTableFilterValue = string | string [] | Date | null;

export type FeedbackTableFilters = {
  name: string;
  type: string;
  issue: string;
  element: string;
  startDate: Date | null;
};

// ----------------------------------------------------------------------

export type Feedback = {
  id: string;
  type: string;
  element: string;
  description: string;
  creator: string;
  createDate: Date;
  issue: string;
};


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
  issue: string;
  imageUrl: string;
  videosUrl: string[];
  created_by: string;
  created_at: Date;
};

export type FeedbackDatagrids = {
  id: string;
  type: string;
  element: string;
  description: string;
  issue: string;
  created_by: string;
  created_at: Date;
};

export type FeedbackRFCType = {
  id: string;
  description: string;
  created_by: string;
};

export type FeedbackBugFixType = {
  id: string;
  description: string;
  imageUrl: string;
  videosUrl: string[];
  created_by: string;
  created_at: string;
};

export type FeedbackType = {
  value: string;
  label: string;
  color: string;
};

export type FeedbackElement = {
  value: string;
  label: string;
};


export type FeedbackIssue = {
  value: string;
  label: string;
};

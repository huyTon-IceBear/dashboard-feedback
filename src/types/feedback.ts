
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
  description: string;
  created_by: string;
};

export type FeedbackBugFixType = {
  description: string;
  imageUrl: string;
  videosUrl: string[];
  created_by: string;
  created_at: string;
};

import { subDays } from 'date-fns';
//
import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const FEEDBACK_STATUS_OPTIONS = [
  { value: 'positive', label: 'Positive' },
  { value: 'negative', label: 'Negative' },
];
export const FEEDBACK_ISSUE_OPTIONS = [
  { value: 'rfc', label: 'RFC' },
  { value: 'bugfix', label: 'Bug Fix' },
];

export const FEEDBACK_ELEMENT_OPTIONS = [
  { value: 'component', label: 'component' },
  { value: 'page', label: 'page' },
];

export const _feedbacks = [...Array(20)].map((_, index) => {
  const type = index % 2 === 0 ? 'positive' : 'negative' ;
  const issue = index % 2 === 0 ? 'rfc' : 'bugfix' ;
  const element = index % 2 === 0 ? 'component' : 'page' ;

  return {
    id: _mock.id(index),
    type,
    element,
    description: _mock.feedback( index % 2),
    creator: _mock.fullName(index),
    createDate: subDays(new Date(), index),
    issue,
  };
});

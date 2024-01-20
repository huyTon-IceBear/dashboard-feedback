import { gql } from '@apollo/client';

const GET_FEEDBACKS = gql`
  query GET_FEEDBACKS {
    feedback {
      id
      description
      element
      issue
      type
      created_at
      created_by
    }
  }
`;

const GET_FEEDBACK_TYPES = gql`
  query GET_FEEDBACK_TYPES {
    feedback_type {
      label
      value
      color
    }
  }
`;

const GET_FEEDBACK_ELEMENTS = gql`
  query GET_FEEDBACK_ELEMENTS {
    feedback_element {
      label
      value
    }
  }
`;
const GET_FEEDBACK_ISSUES = gql`
  query GET_FEEDBACK_ISSUES {
    feedback_issue {
      label
      value
    }
  }
`;

export {GET_FEEDBACKS,GET_FEEDBACK_TYPES, GET_FEEDBACK_ELEMENTS,GET_FEEDBACK_ISSUES}

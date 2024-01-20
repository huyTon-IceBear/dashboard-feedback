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

const GET_FEEDBACK_BEFORE_DATE = gql`
  query GET_FEEDBACK_BEFORE_DATE($created_at: timestamptz!) {
    feedback(where: { created_at: { _gte: $created_at } }) {
      created_at
    }
  }
`;

const GET_FEEDBACK_TOTAL = gql`
  query GET_FEEDBACK_TOTAL {
    feedback_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const GET_FEEDBACK_SUM_ON_TYPE = gql`
  query GET_FEEDBACK_SUM_ON_TYPE($type: String!) {
    feedback_aggregate(where: { type: { _eq: $type } }) {
      aggregate {
        count
      }
    }
  }
`;


export {GET_FEEDBACKS,GET_FEEDBACK_TYPES, GET_FEEDBACK_ELEMENTS, GET_FEEDBACK_ISSUES, GET_FEEDBACK_BEFORE_DATE, GET_FEEDBACK_TOTAL, GET_FEEDBACK_SUM_ON_TYPE}

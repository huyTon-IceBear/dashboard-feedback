import { gql } from '@apollo/client';

export const GET_A_FEEDBACK = gql`
  query GET_A_FEEDBACK($id: uuid!) {
    feedback_by_pk(id: $id) {
      id
      description
      element
      issue
      type
      imageUrl
      videosUrl
      created_at
      created_by
    }
  }
`;

export const GET_A_FEEDBACK_RFC = gql`
  query GET_A_FEEDBACK($id: uuid!) {
    feedback_by_pk(id: $id) {
      description
      created_by
    }
  }
`;

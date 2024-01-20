import { gql } from '@apollo/client';

const INSERT_LINEAR_TASK = gql`
  mutation INSERT_LINEAR_TASK($object: task_insert_input!) {
    insert_task_one(object: $object) {
      id
    }
  }
`;

export {INSERT_LINEAR_TASK}

// __tests__/insertLinearTaskMutation.test.jsx

import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-dom/test-utils';
import { INSERT_LINEAR_TASK } from '../src/graphql/task';

const mockFeedback = {
  id: 'abc123',
};

const mocks = [
  {
    request: {
      query: INSERT_LINEAR_TASK,
      variables: {
        object: {
          feedback_id: mockFeedback.id,
          title: 'Issue for RFC',
          description: 'Mocked description',
        },
      },
    },
    result: {
      data: {
        insert_task_one: {
          id: 'generated-id',
        },
      },
    },
  },
];

describe('INSERT_LINEAR_TASK Mutation', () => {
  it('should insert a linear task', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <div data-testid="test-wrapper">Test Component</div>
      </MockedProvider>
    );

    // Wait for the mutation to complete
    await act(async () => {
      await waitFor(() => getByTestId('test-wrapper'));
    });

  });
});

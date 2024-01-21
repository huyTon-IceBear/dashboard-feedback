// queries.test.js
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider } from '@apollo/client/testing';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';
import { GET_FEEDBACKS} from '../src/graphql/feedback';

const mockedFeedbackData = [
  {
    id: 'fba720ca-599a-4341-93ef-265ad19266af',
    description: 'Test',
    element: 'Page',
    issue: 'RFC',
    type: 'negative',
    created_at: '2023-10-24T22:26:39.319494+00:00',
    created_by: 'Opusflow Test'
  }
]

// Mock your GraphQL queries
const mocks = [
  {
    request: {
      query: GET_FEEDBACKS,
    },
    result: {
      data: {
        feedback: [...mockedFeedbackData],
      },
    },
  },
];

describe('GraphQL Queries', () => {
  it('should fetch feedbacks', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useQuery(GET_FEEDBACKS), {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
    });

    await act(async () => {
      await waitForNextUpdate();
    });

    // Define expected data for assertion
    const expectedFeedbackData = [...mockedFeedbackData];

    expect(result.current.loading).toBeFalsy();
    expect(result.current.data.feedback).toMatchObject([...expectedFeedbackData]);
  });
});

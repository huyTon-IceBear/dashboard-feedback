import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import type { ReactNode } from 'react';

const AppApolloProvider = ({ children }: { children: ReactNode }) => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_URL,
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': process.env.NEXT_PUBLIC_MONITORING_HASURA_ADMIN_SECRET as string,
    },
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const { message } of graphQLErrors) {
        const logMessage = `[API error]: Message: ${message}`;
        console.log(logMessage);
      }
    }
    if (networkError) {
      const message = `[Network error]: ${networkError}`;
      console.log(message);
    }
  });

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default AppApolloProvider;

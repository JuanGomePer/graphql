import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/';

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache(),
});

export default client;

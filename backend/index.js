const { ApolloServer, gql } = require("apollo-server");
const { allAsync, getAsync } = require("./db");

const typeDefs = gql`
  type Breed {
    id: ID!
    name: String
    origin: String
    lifeSpan: String
    temperament: String
  }

  type Student {
    id: ID!
    firstName: String
    lastName: String
    email: String
    age: Int
    major: String
  }

  type Query {
    breed(id: ID!): Breed
    students: [Student!]!
  }
`;

const resolvers = {
  Query: {
    async breed(_, { id }) {
      return await getAsync("SELECT * FROM breeds WHERE id = ?", [id]);
    },
    async students() {
      return await allAsync("SELECT * FROM students");
    },
  },
};

const PORT = process.env.PORT || 4000;

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`GraphQL API lista en http://0.0.0.0:${PORT}`);
}

start();

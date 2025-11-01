const { ApolloServer, gql } = require("apollo-server");
const fetch = require("node-fetch");
const { allAsync } = require("./db");

// ✅ GraphQL Schema
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

// ✅ GraphQL Resolvers
const resolvers = {
  Query: {
    // 🐱 Fetch a cat breed from TheCatAPI
    async breed(_, { id }) {
      try {
        const response = await fetch(
          `https://api.thecatapi.com/v1/breeds/${id}`,
          {
            headers: {
              "x-api-key": process.env.CAT_API_KEY, // 👈 use your API key from .env
            },
          }
        );

        if (!response.ok) throw new Error(`Breed not found: ${id}`);
        const data = await response.json();

        return {
          id: data.id,
          name: data.name,
          origin: data.origin,
          lifeSpan: data.life_span,
          temperament: data.temperament,
        };
      } catch (error) {
        console.error("Error fetching breed:", error);
        return null;
      }
    },

    // 🎓 Get students from SQLite
    async students() {
      return await allAsync("SELECT * FROM students");
    },
  },
};

// ✅ Server Setup
const PORT = process.env.PORT || 4000;

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    persistedQueries: false,
  });

  const { url } = await server.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`🚀 GraphQL API running at ${url}`);
}

start();

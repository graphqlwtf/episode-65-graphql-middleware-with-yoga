import { createServer } from "@graphql-yoga/node";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";

const typeDefs = /* GraphQL */ `
  type Query {
    episodes(limit: Int! = 1): [Episode]
  }

  type Episode {
    title: String!
    number: Int!
  }
`;

const resolvers = {
  Query: {
    episodes: (_: any, { limit }: { limit: number }) =>
      [
        { title: "GraphQL Middleware", number: 65 },
        { title: "Working with GraphiQL", number: 44 },
        { title: "What is GraphQL?", number: 50 },
      ].slice(0, limit),
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const logInput = async (resolve, parent, args, context, info) => {
  console.log({ args });
  const result = await resolve(parent, args, context, info);

  return result;
};

const logResult = async (resolve, parent, args, context, info) => {
  const result = await resolve(parent, args, context, info);
  console.log({ result });

  return result;
};

const uppercaseTitle = async (resolve, parent, args, context, info) => {
  const result = await resolve(parent, args, context, info);

  return result.toUpperCase();
};

const schemaWithMiddleware = applyMiddleware(schema, logInput, logResult, {
  Episode: {
    title: uppercaseTitle,
  },
});

const server = createServer({
  schema: schemaWithMiddleware,
});

server.start();

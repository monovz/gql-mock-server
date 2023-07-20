import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { v4 as uuidv4 } from 'uuid';

const typeDefs = `#graphql
  type Person{
    name: String!
    age: Int!
  }

  type Query {
    getPerson: [Person]
  }

  type Mutation {
    addPerson(name: String!, age: Int!): Person
  }
`;

const persons = [{
  name: 'tes',
  age: 2
}]

const resolvers = {
  Query: {
    getPerson() {
      return persons
    }
  },
  Mutation: {
    addPerson(_, { name, age }) {
      persons.push({ name, age })
      return {name, age}
    }
  }
};

const mocks = {
  Person: () => persons
};

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    mocks,
    preserveResolvers: true,
  }),
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
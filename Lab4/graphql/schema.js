export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    role: String
  }

  type Event {
    id: ID!
    title: String!
    description: String
    date: String
    creator: User!
    participants: [Participant!]! 
  }

  type Participant {
    id: ID!
    user: User!
    event: Event!
    registeredAt: String
  }

  input EventInput {
    title: String!
    description: String
    date: String
  }

  type Query {
    getEvents(limit: Int, skip: Int, title: String): [Event]
  }

  type Mutation {
    addEvent(input: EventInput!): Event
  }
`;
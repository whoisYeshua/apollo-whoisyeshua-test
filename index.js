import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefsPath = resolve('./schema.gql')
const typeDefs = readFileSync(typeDefsPath).toString('utf-8')

const resolvers = {
  Query: {
    test: () => 'test',
  },
}

const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Hello',
}

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    mocks,
  }),
  introspection: true,
})

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })

console.log(`🚀 Server listening at: ${url}`)

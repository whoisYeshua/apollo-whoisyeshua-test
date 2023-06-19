import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { addMocksToSchema } from '@graphql-tools/mock'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { bigintScalar } from './scalars/bigintScalar.js'
import { dateScalar } from './scalars/dateScalar.js'

const typeDefsPath = resolve('./schema.gql')
const typeDefs = readFileSync(typeDefsPath).toString('utf-8')

const resolvers = {
  Bigint: bigintScalar,
  Date: dateScalar,
  Query: {
    test: () => 'test2',
    age: () => Number.MAX_SAFE_INTEGER - 1,
    date: () => new Date(),
  },
}

const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Hello',
  Date: () => new Date('2011', '11', '11'),
  Bigint: () => 3_000_000_000,
}

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    preserveResolvers: true,
    mocks,
  }),
  introspection: true,
})

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })

console.log(`🚀 Server listening at: ${url}`)

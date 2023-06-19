import { GraphQLScalarType, Kind, GraphQLError } from 'graphql'

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Пользовательский скалярный тип даты',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime() // Convert outgoing Date to integer for JSON
    }
    throw new GraphQLError('Сериализатор GraphQL Date Scalar ожидает объект `Date`')
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value) // Convert incoming integer to Date
    }
    throw new GraphQLError('Парсер GraphQL Date Scalar ожидает получить `number`')
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10))
    }
    // Invalid hard-coded value (not an integer)
    return null
  },
})

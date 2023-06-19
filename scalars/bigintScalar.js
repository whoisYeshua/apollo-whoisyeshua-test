import { GraphQLScalarType, Kind, GraphQLError } from 'graphql'

const MAX_INT = Number.MAX_SAFE_INTEGER
const MIN_INT = Number.MIN_SAFE_INTEGER

const coerceBigint = value => {
  if (value === '') {
    throw new GraphQLError(
      'Bigint не может представлять не 53-битное целочисленное значение: (пустая строка)'
    )
  }
  const num = Number(value)
  if (num > MAX_INT || num < MIN_INT) {
    throw new GraphQLError(
      `Bigint не может представлять не 53-битное целочисленное значение: ${String(value)}`
    )
  }
  const int = Math.floor(num)
  if (int !== num) {
    throw new GraphQLError(`Bigint не может представлять нецелое значение: ${String(value)}`)
  }
  return int
}

export const bigintScalar = new GraphQLScalarType({
  name: 'Bigint',
  description:
    'Скалярный тип `Bigint` представляет нефракционные целые числовые значения. Bigint может представлять значения между -(2^53) + 1 и 2^53 - 1.',
  serialize: coerceBigint,
  parseValue: coerceBigint,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const num = parseInt(ast.value, 10)
      if (num <= MAX_INT && num >= MIN_INT) {
        return num
      }
    }
    return null
  },
})

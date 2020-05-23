import { sum } from '../src/sum'

test('sum up numbers', () => {
  expect(sum(1, 2)).toBe(3)
})

test('sum up numbers with NaN', () => {
  expect(sum(NaN, 1, 2)).toBe(3)
})

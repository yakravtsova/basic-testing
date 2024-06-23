// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 1, b: 2, action: Action.Subtract, expected: -1 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 1, b: 2, action: Action.Divide, expected: 0.5 },
  {
    a: 100,
    b: 0,
    action: Action.Exponentiate,
    expected: 1,
  },
  {
    a: 100,
    b: 0,
    action: 'ololo',
    expected: null,
  },
  {
    a: '100',
    b: 0,
    action: Action.Add,
    expected: null,
  },
  {
    a: 100,
    b: [1, 2],
    action: Action.Add,
    expected: null,
  },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    '$a $action $b expected to be $expected: ',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});

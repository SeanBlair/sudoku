import { assert, describe, it } from 'vitest';
import { allValuesAreUnique, deepClone, getEmptySudokuOptions, shuffle } from './utils';

describe('getEmptySudokuOptions', () => {
  it('returns an array of length 9', () => {
    const result = getEmptySudokuOptions();

    assert.equal(result.length, 9)
  })

  it('returns an array of empty strings', () => {
    const result = getEmptySudokuOptions();

    assert.isTrue(result.every(v => v === ''))
  })
})

describe('deepClone', () => {
  it('deep clones the given object', () => {
    const original = {
      'foo': {
        'bar': 'baz'
      }
    };

    const cloned = deepClone(original);

    assert.deepEqual(cloned, original);

    original.foo.bar = '42';

    assert.notEqual(cloned.foo.bar, original.foo.bar)
  })
})

describe('allValuesAreUnique', () => {
  it('returns true when all values are unique', () => {
    assert.isTrue(allValuesAreUnique([1, 2, 3, 4, 5, 6]))
  })


  it('returns false when a value is repeated', () => {
    assert.isFalse(allValuesAreUnique([1, 2, 3, 4, 5, 1]))
  })
})

describe('shuffle', () => {
  it('shuffles the given array', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const shuffled = shuffle([...original]);

    assert.isTrue(shuffled.some((value, index) => original[index] !== value)); 
  })
})


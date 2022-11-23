import { test, expect, assert, describe, it } from 'vitest';
import { getEmptySudokuOptions } from './sudokuUtils';

describe('getEmptySudokuOptions', () => {
  it('returns an array of length 9, full of empty strings', () => {
    const result = getEmptySudokuOptions();

    assert.equal(result.length, 9)
  })

  it('returns an array of empty strings', () => {
    const result = getEmptySudokuOptions();

    assert.isTrue(result.every(v => v === ''))
  })
})

test('getEmptySudokuOptions', () => {

  const result = getEmptySudokuOptions();

  assert.equal(result.length, 9)
});

test('')


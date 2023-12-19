import { Fail, Success, fail, success } from '.'

describe('ResponseHandling', () => {
  test('sucess result', () => {
    const result = success('foo')

    expect(result).toEqual({
      value: 'foo',
    })
  })

  test('fail result', () => {
    const result = fail('foo')

    expect(result).toEqual({
      error: 'foo',
    })
  })

  test('is success', () => {
    const result = success('foo')

    expect(Success.is(result)).toBe(true)
    expect(Fail.is(result)).toBe(false)
  })

  test('is fail', () => {
    const result = fail('foo')

    expect(Success.is(result)).toBe(false)
    expect(Fail.is(result)).toBe(true)
  })
})

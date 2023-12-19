import { WatchedList } from '.'

class TestWatchedList extends WatchedList<number> {
  public compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('WatchedList', () => {
  test('should create a new list', () => {
    const list = new TestWatchedList()

    expect(list.getItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should create a new list with initial items', () => {
    const list = new TestWatchedList([1, 2, 3])

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should add a new item', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.add(4)

    expect(list.getItems()).toEqual([1, 2, 3, 4])
    expect(list.getNewItems()).toEqual([4])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should not add an existing item', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.add(2)

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should remove an existing item', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.remove(2)

    expect(list.getItems()).toEqual([1, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([2])
  })

  test('should not remove a non-existing item', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.remove(4)

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should not remove an item twice', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.remove(2)
    list.remove(2)

    expect(list.getItems()).toEqual([1, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([2])
  })

  test('should not add an item twice', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.add(2)
  })

  test('should add an item that was removed', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.remove(2)
    list.add(2)

    expect(list.getItems()).toEqual([1, 3, 2])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should remove an item that was added', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.add(4)
    list.remove(4)

    expect(list.getItems()).toEqual([1, 2, 3])
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  test('should update watched list', () => {
    const list = new TestWatchedList([1, 2, 3])

    list.update([1, 2, 4])

    expect(list.getItems()).toEqual([1, 2, 4])
    expect(list.getNewItems()).toEqual([4])
    expect(list.getRemovedItems()).toEqual([3])
  })
})

import { CommentWithAuthor } from '.'

test('create an comment with author', async () => {
  const props = {
    author: {
      id: '123',
      name: 'John Doe',
    },
    comment: {
      id: '123',
      content: 'This is a comment',
      createdAt: new Date(),
    },
  }

  const commentWithAuthor = CommentWithAuthor.create(props)

  expect(JSON.stringify(commentWithAuthor.props)).toEqual(JSON.stringify(props))
})

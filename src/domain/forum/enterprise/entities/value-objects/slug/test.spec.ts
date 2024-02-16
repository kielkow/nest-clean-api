import { Slug } from '.'

test('create an slug', async () => {
  const slug = Slug.createFromText('This Is- the_ Slug @')

  expect(slug.value).toEqual('this-is-the-slug')
})

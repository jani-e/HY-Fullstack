import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


describe('Blog testit:', () => {

  const mockBlog = {
    id: 'mockedid',
    title: 'mockedtitle',
    author: 'mockedauthor',
    url: 'www.test.com',
    likes: 1,
    user: {
      id: 'mockedid',
      name: 'mockedname',
      username: 'mockedusername'
    }
  }

  const mockUser = {
    username: 'mocked'
  }

  const mockLike = jest.fn()
  const mockDelete = jest.fn()

  let container

  beforeEach(() => {
    container = render(
      <Blog blog={mockBlog} handleLike={mockLike} deleteBlog={mockDelete} user={mockUser} />
    ).container
  })

  test('5.13: renders title and author but not url and likes', () => {
    const div = container.querySelector('.narrow')
    expect(div).toHaveTextContent('mockedtitle')
    expect(div).toHaveTextContent('mockedauthor')
    expect(div).not.toHaveTextContent('www.test.com')
    expect(div).not.toHaveTextContent('likes')
  })

  test('5.14: url, likes and user is rendered after clicking show button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    const div = container.querySelector('.expanded')
    expect(div).toHaveStyle('display: none')
    await user.click(button)
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('mockedtitle')
    expect(div).toHaveTextContent('mockedauthor')
    expect(div).toHaveTextContent('likes 1')
    expect(div).toHaveTextContent('mockedname')
  })

  test('5.15: props function is called twice with like button', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
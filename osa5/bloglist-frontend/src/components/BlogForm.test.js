import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('BlogForm testit:', () => {

  test('5.16 BlogForm submit uses callback prop with correct inputs', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const { container } = render(
      <BlogForm createBlog={createBlog} />
    )

    const inputTitle = screen.getAllByRole('textbox')
    const inputAuthor = screen.getByPlaceholderText('write author here')
    const inputUrl = container.querySelector('#url')
    const submitButton = screen.getByText('create')

    await user.type(inputTitle[0], 'mocktitle')
    await user.type(inputAuthor, 'mockauthor')
    await user.type(inputUrl, 'www.mock.url')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('mocktitle')
    expect(createBlog.mock.calls[0][0].author).toBe('mockauthor')
    expect(createBlog.mock.calls[0][0].url).toBe('www.mock.url')

    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'mocktitle',
      author: 'mockauthor',
      url: 'www.mock.url'
    })
  })
})
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('New Blog form is calling the event handler with the correct details', async () => {
  const createNewBlog = jest.fn()
  const user = userEvent.setup()

  render(<NewBlogForm createNewBlog={createNewBlog}/>)

  const titleInput = screen.getByPlaceholderText('Write Blog Title')
  const authorInput = screen.getByPlaceholderText('Write Blog Author Name')
  const URLInput = screen.getByPlaceholderText('Provide Blog URL link')
  const addNewBlogButton = screen.getByText('Add New Blog')

  await user.type(titleInput, 'WEEKEND BOX OFFICE RESULTS: THE FLASH AND ELEMENTAL SECURE DISAPPOINTING DEBUTS')
  await user.type(authorInput, 'Erik Childress')
  await user.type(URLInput, 'https://editorial.rottentomatoes.com/article/weekend-box-office-results-the-flash-and-elemental-secure-disappointing-debuts/')
  await user.click(addNewBlogButton)

  expect(createNewBlog.mock.calls).toHaveLength(1)
  expect(createNewBlog.mock.calls[0][0].title).toBe('WEEKEND BOX OFFICE RESULTS: THE FLASH AND ELEMENTAL SECURE DISAPPOINTING DEBUTS')
  expect(createNewBlog.mock.calls[0][0].author).toBe('Erik Childress')
  expect(createNewBlog.mock.calls[0][0].url).toBe('https://editorial.rottentomatoes.com/article/weekend-box-office-results-the-flash-and-elemental-secure-disappointing-debuts/')
})
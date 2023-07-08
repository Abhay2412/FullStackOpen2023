import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Renders the default blog view', () => {
  const blogToCheck = {
    title: 'Reports: Suns finalizing deal to add Bradley Beal in trade with Wizards',
    author: 'NBA.com',
    url: 'https://www.nba.com/news/wizards-suns-trade-bradley-beal-chris-paul',
    likes: 85,
    user: {
      id:'John Cena'
    }
  }

  const user = {
    id: 'John Cena'
  }

  const { container } = render(<Blog blog={blogToCheck} user={user}/>)

  const div = container.querySelector('.defaultBlogView')

  expect(div).toHaveTextContent('Reports: Suns finalizing deal to add Bradley Beal in trade with Wizards NBA.com')
})

test('Renders the detailed blog view', async () => {
  const blogToCheck = {
    title: 'Reports: Suns finalizing deal to add Bradley Beal in trade with Wizards',
    author: 'NBA.com',
    url: 'https://www.nba.com/news/wizards-suns-trade-bradley-beal-chris-paul',
    likes: 85,
    user: {
      id:'John Cena'
    }
  }

  const user = {
    id: 'John Cena'
  }

  const { container } = render(<Blog blog={blogToCheck} user={user}/>)

  const div = container.querySelector('.detailedBlogView')

  expect(div).toHaveTextContent('https://www.nba.com/news/wizards-suns-trade-bradley-beal-chris-paul')
  expect(div).toHaveTextContent('85')
})

test('Likes button is clicked twice', async () => {
  const blogToCheck = {
    title: 'Reports: Suns finalizing deal to add Bradley Beal in trade with Wizards',
    author: 'NBA.com',
    url: 'https://www.nba.com/news/wizards-suns-trade-bradley-beal-chris-paul',
    likes: 85,
    user: {
      id:'John Cena'
    }
  }

  const user = {
    id: 'John Cena'
  }

  const mockHanlder = jest.fn()

  render(<Blog blog={blogToCheck} user={user} updateLikes={mockHanlder}/>)

  const users = userEvent.setup()
  const likeButton = screen.getByText('Like')
  await users.click(likeButton)
  await users.click(likeButton)

  expect(mockHanlder.mock.calls).toHaveLength(2)
})
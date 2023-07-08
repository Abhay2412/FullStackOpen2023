describe('Blog application', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const newUserForTesting = {
      name: 'End Testing User',
      username: 'endtwoendtester',
      password: 'endtwotestingisgood'
    }
    const secondNewUserForTesting = {
      name: 'Tester User',
      username: 'part5tester',
      password: 'fullstackopen2023'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', newUserForTesting)
    cy.request('POST', 'http://localhost:3003/api/users/', secondNewUserForTesting)
    cy.visit('http://localhost:3000')
  })
  it('The login form is shown', function() {
    cy.contains('Log in to view Blogs')
    cy.contains('Username')
    cy.contains('Password')
  })
  describe('Login functionality is checked', function() {
    it('Correct credentials are provided to Login form', function() {
      cy.get('#username').type('endtwoendtester')
      cy.get('#password').type('endtwotestingisgood')
      cy.get('#login-button').click()
      cy.contains('End Testing User has logged into the application')
    })
    it('Incorrect credentials are provided to Login form', function() {
      cy.get('#username').type('endtwoendtester')
      cy.get('#password').type('incorrectPassword')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'Incorrect username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe('When logged into the Blog application', function() {
    beforeEach(function() {
      cy.login('endtwoendtester', 'endtwotestingisgood')
    })
    it('A new blog can be created', function() {
      cy.contains('New Blog').click()
      cy.get('#title').type('Date set for Calgary Heritage federal byelection')
      cy.get('#author').type('Michael Rodriguez')
      cy.get('#url').type('https://calgaryherald.com/news/politics/calgary-heritage-federal-byelection-date')
      cy.get('#add-new-blog-button').click({ force: true })
      cy.contains('New blog created successfully with the title Date set for Calgary Heritage federal byelection from this author Michael Rodriguez')
    })
    describe('When a blog is present in the application', function() {
      beforeEach(function() {
        cy.createNewBlog({
          'title': 'Date set for Calgary Heritage federal byelection',
          'author': 'Michael Rodriguez',
          'url': 'https://calgaryherald.com/news/politics/calgary-heritage-federal-byelection-date'
        })
      })
      it('A blog can be liked by a user', function() {
        cy.contains('View Blog Details').click()
        cy.contains('Like').click()
        cy.get('.notification').should('contain', 'Liked the following blog with the title Date set for Calgary Heritage federal byelection from this author Michael Rodriguez')
        cy.get('.notification').should('have.css', 'color', 'rgb(0, 128, 0)')
      })
      it('A blog can only be deleted by the user who created it', function() {
        cy.contains('View Blog Details').click()
        cy.get('#remove-blog-button').click()
        cy.get('.notification').should('contain', 'Deleted the following blog with the title Date set for Calgary Heritage federal byelection from this author Michael Rodriguez')
        cy.get('.notification').should('have.css', 'color', 'rgb(0, 128, 0)')
      })
    })
  })
  describe('More than one user is present in the application', function() {
    beforeEach(function() {
      cy.login('endtwoendtester', 'endtwotestingisgood')
      cy.createNewBlog({
        'title': 'Date set for Calgary Heritage federal byelection',
        'author': 'Michael Rodriguez',
        'url': 'https://calgaryherald.com/news/politics/calgary-heritage-federal-byelection-date'
      })
    })
    it('Only the user who originally created the blog can delete it', function() {
      cy.contains('Logout').click()
      cy.login('part5tester', 'fullstackopen2023')
      cy.contains('View Blog Details').click()
      cy.contains('Remove Blog').should('not.exist')
    })
  })
  describe('Checking correct order of blogs by the number of likes', function() {
    beforeEach(function() {
      cy.login('endtwoendtester', 'endtwotestingisgood')
      cy.createNewBlog({ 'title': 'Test Blog 1', 'author': 'Kevin Durant', 'url': 'https://calgaryherald.com/test1', 'likes': '7' })
      cy.createNewBlog({ 'title': 'Test Blog 2', 'author': 'Kevin Durant', 'url': 'https://calgaryherald.com/test2', 'likes': '5' })
      cy.createNewBlog({ 'title': 'Test Blog 3', 'author': 'Kevin Durant', 'url': 'https://calgaryherald.com/test3', 'likes': '3' })
    })
    it('Correct sequence of blogs by number of likes', function() {
      cy.contains('Test Blog 1').find('button').click()
      cy.contains('Test Blog 2').find('button').click()
      cy.contains('Test Blog 3').find('button').click()
      cy.get('#likes-count').should('contain', '7')
      cy.get('#likes-count').should('not.contain', '5')
      cy.get('#likes-count').should('not.contain', '3')
    })
  })
})
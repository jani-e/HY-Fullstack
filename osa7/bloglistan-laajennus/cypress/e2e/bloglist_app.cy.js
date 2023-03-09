describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Jani Testaus',
      username: 'jerik',
      password: 'passu'
    }
    const user2 = {
      name: 'Testaaja2',
      username: 'jerik2',
      password: 'passu'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('5.17: Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('5.18: Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('jerik')
      cy.get('#password').type('passu')
      cy.get('#login').click()
      cy.contains('blogs')
      cy.contains('Jani Testaus logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrong')
      cy.get('#password').type('credentials')
      cy.get('#login').click()
      cy.contains('Log in to application')
      cy.contains('wrong username or password')
    })
  })

  describe('5.19: When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'jerik', password: 'passu' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Test blog 1')
      cy.get('#author').type('Blogster')
      cy.get('#url').type('www.blogs.com/1')
      cy.get('#create-button').click()
      cy.contains('a new blog Test blog 1 by Blogster added')
      cy.contains('Test blog 1 Blogster')
    })
  })

  describe('When logged in and blogs exist', function () {
    beforeEach(function () {
      cy.login({ username: 'jerik', password: 'passu' })
      cy.create({
        title: 'Test blog 2',
        author: 'Blogster',
        url: 'www.blogs.com/2',
        likes: 0
      })
      cy.create({
        title: 'Test blog 3',
        author: 'Blogster',
        url: 'www.blogs.com/3',
        likes: 0
      })
      cy.visit('http://localhost:3000')
    })

    it('5.20: A blog can be liked', function () {
      cy.contains('Test blog 2 Blogster').contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('5.21: A blog can be deleted by its user', function () {
      cy.contains('Test blog 2 Blogster').contains('view').click()
      cy.contains('remove').click()
      cy.on('window:alert', (message) => {
        expect(message).to.contains('Remove blog Test blog 2 by Blogster')
      })
      cy.contains('Test blog 2 Blogster').should('not.exist')
    })

    it('5.22: When logged in as another user, a blog cant be deleted', function () {
      cy.login({ username: 'jerik2', password: 'passu' })
      cy.visit('http://localhost:3000')
      cy.contains('Test blog 2 Blogster').contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('5.23: Blogs are sorted correctly by likes', function() {
      cy.get('.blog').eq(0).should('contain', 'Test blog 2')
      cy.get('.blog').eq(1).should('contain', 'Test blog 3').as('ToHaveMostLikes')
      cy.get('@ToHaveMostLikes').contains('view').click()
      cy.get('@ToHaveMostLikes').contains('like').click()
      cy.get('@ToHaveMostLikes').contains('likes 1')
      cy.get('.blog').eq(0).should('contain', 'Test blog 3')
      cy.get('.blog').eq(1).should('contain', 'Test blog 2')
    })
  })

})
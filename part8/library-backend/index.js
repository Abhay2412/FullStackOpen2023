const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('Connecting to:', MONGODB_URI)

mongoose.connect(MONGODB_URI).then(() => {console.log('Connected to MongoDB')})
.catch((error) => {
  console.log('Error connecting to MongoDB:', error.message)
})

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: String!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    id: ID!
    born: String
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: String!
      genres: [String!]
    ) : Book
    editAuthor(
       name: String!
       born: String!
    ) : Author
    createUser)(
      username: String!
    ) : User
    login(
      username: String!
      password: String!
    ) : Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const authorToFind = await Author.findOne({ name: args.author })
      if(args.author && args.genre) {
          return await Book.find({ author: authorToFind.id, genres: { $in: args.genres }  }).populate('author')
      }
      else if(args.author) {
        return await Book.find({ author: authorToFind.id }).populate('author')
      }
      else if(args.genre) {
        return await Book.find({ genres: { $in: args.genres } }).populate('author')
      }
      else {
        return await Book.find({}).populate('author')
      }
        
    },
    allAuthors: async () => {
      return Author.find({})
    }, 
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const authorToFind = await Author.findOne({ name: args.author })
      const booksToFind = await Book.find({ author: authorToFind.id }).countDocuments({})
      return booksToFind.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
        const currentAuthorCheck = await Author.findOne({ name: args.author })
        const currentUser = context.currentUser
        if(!currentUser) {
          throw new GraphQLError('Not Authenticated', {
            extensions: {
              code:'BAD_USER_INPUT'
            }
          })
        }
        if(!currentAuthorCheck) {
          const newAuthorToAdd = new Author({ name: args.author })
          try {
            await newAuthorToAdd.save()
          } 
          catch(error) {
            throw new GraphQLError('Adding new author failed', {
              extensions: {
                code:'BAD_USER_INPUT',
                invalidArgs: args,
                error
              }
            })
          }
        }
        const authorToFind = await Author.findOne({ name: args.author })
        const bookToAdd = new Book ({ ...args, author: authorToFind}) 
        try {
          await bookToAdd.save()
          return bookToAdd
        } catch(error) {
          throw new GraphQLError('Adding new book failed',  {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }
    }, 
    editAuthor: async(root, args, context) => {
       const authorToUpdate = await Author.findOne({ name: args.author })
       const currentUser = context.currentUser
       if(!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code:'BAD_USER_INPUT',
          }
        })
       }
       if(!authorToUpdate) {
        return null
       } 
       else {
        authorToUpdate.born = args.born
        try {
          await authorToUpdate.save()
        } catch(error) {
          throw new GraphQLError('Updating the birth year failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name, 
              error
            }
          })
        }
        return authorToUpdate
       }
    },
    createUser: async(root, args) => {
      const newUserToAdd = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })
      return newUserToAdd.save()
      .catch(error => {
        throw new GraphQLError('Adding new user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name, 
            error
          }
        })
      })
    },
    login: async(root, args) => {
      const userToFind = await User.findOne({ username: args.username })

      if(!userToFind) {
        throw new GraphQLError('Incorrect credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const userToken = {
        username: userToFind.username,
        id: userToFind._id
      }

      return { value: jwt.sign(userToken, process.env.SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  context: async({ request, response }) => {
    const auth = request ? request.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
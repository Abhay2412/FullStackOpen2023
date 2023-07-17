const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
        return Author.find({}).populate('books')
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
            authorToFind.books = authorToFind.books.concat(bookToAdd.id)
            await authorToFind.save()

            const newBook = await Book.findById(bookToAdd.id).populate('author')
          } catch(error) {
            throw new GraphQLError('Adding new book failed',  {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args,
                error
              }
            })
          }
          pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
          return bookToAdd
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
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        }
    }
  }

  module.exports = resolvers
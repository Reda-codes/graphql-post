import {ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const authors = [
  { id: '1', name: 'Author 1' },
  { id: '2', name: 'Author 2' },
  { id: '3', name: 'Author 3' },
];

const books = [
  { id: '1', title: 'Book 1', authorId: '1' },
  { id: '2', title: 'Book 2', authorId: '2' },
  { id: '3', title: 'Book 3', authorId: '3' },
  { id: '4', title: 'Book 4', authorId: '1' },
  { id: '5', title: 'Book 5', authorId: '2' },
];

const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    books: [Book!]
  }

  type Book {
    id: ID!
    title: String!
    author: [Author]!
  }

  type Query {
    author(id: ID): [Author]
    authors: [Author!]!
    book(id: ID): [Book]
    books: [Book!]!
  }

  type Mutation {
    addAuthor(name: String!): Author
    addBook(title: String!, authorId: String!): Book
  }
`;


const resolvers = {
Query: {
    author: (parent, { id }) => authors.find(author => author.id === id)? [authors.find(author => author.id === id)] : new Error(`Author with ID ${id} does not exist`),
    authors: () => authors,
    book: (parent, { id }) => [books.find(book => book.id === id)],
    books: () => books,
  },
Author: {
    books: (author) => {
    return books.filter(book => book.authorId === author.id)
    },
},
Book: {
    author: (book) => {
    return authors.filter(author => author.id === book.authorId)
    },
},

Mutation: {
  addAuthor(parent, {name}) {
    const newAuthor = { id: authors.length + 1, name: name };
    authors.push(newAuthor);
    return newAuthor
  },
  addBook(parent, {title, authorId}) {
    const author = authors.find(author => author.id === authorId);
    if (author) {
        const newBook = { id: books.length + 1, title: title, authorId: authorId };
        books.push(newBook);
        return newBook;
    } else {
        throw new Error(`Author with ID ${authorId} does not exist`)
    }

  }
}

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
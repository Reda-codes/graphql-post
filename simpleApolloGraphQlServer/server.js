import {ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const authors = [
  { id: '1', name: 'J. K. Rowling' },
  { id: '2', name: 'George R. R. Martin' },
  { id: '3', name: 'stephen king' },
];

const books = [
  { id: '1', title: 'Fantastic Beasts and Where to Find Them', authorId: '1' },
  { id: '2', title: 'A Game of Thrones', authorId: '2' },
  { id: '3', title: 'Fairy Tale', authorId: '3' },
  { id: '4', title: 'Harry Potter and the Philosopher Stone', authorId: '1' },
  { id: '5', title: 'A Clash of Kings', authorId: '2' },
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
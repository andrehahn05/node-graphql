require("dotenv").config()

const { ApolloServer, gql } = require("apollo-server");
const { importSchema } = require('graphql-import')

const resolvers = require('./src/resolvers/')
const context = require('./src/config/context')
const schemaPath = './src/schema/index.graphql'
// console.log( 
//   process.env.DB_HOST,
//   process.env.DB_PORT,
//   process.env.DB_NAME,
//    process.env.DB_USER,
//    process.env.DB_PASS)

const server = new ApolloServer({
  typeDefs:importSchema(schemaPath),
  resolvers,
  context
});


server.listen().then(({ url }) => {
  console.log(`Executando em ${url}`);
});

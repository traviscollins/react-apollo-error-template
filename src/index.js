const { ApolloClient, InMemoryCache } = require("@apollo/client");

const client = new ApolloClient({
  cache: new InMemoryCache()
});

console.log("Hello Apollo World");

console.log("");
console.log("See the README.md on how to break this just by upgrading to @apollo/client 3.4.0 or higher");

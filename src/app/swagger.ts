import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const server = new Map();
server.set('production', {
  url: 'https://books-rest-api-demo.herokuapp.com/api/v1',
  description: 'Deployed app app on Heroku',
});

server.set('development', {
  url: 'http://localhost:5000/api/v1',
  description: 'Local development/testing app',
});

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Simple book repo REST API', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'REST API for a books api demo app', // short description of the app
  },
  servers: [server.get(process.env.NODE_ENV)],
  components: {},
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./docs/**/*.yml'],
};
// initialize swagger-jsdoc
export default {
  setup: swaggerUI.setup(swaggerJSDoc(options)),
  serve: swaggerUI.serve,
};

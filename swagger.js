const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant API',
    description: 'API documentation for the Restaurant Exam Project',
  },
  host: 'localhost:5002',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']; // Pass the root file where routes are defined

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
});

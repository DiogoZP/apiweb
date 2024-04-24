import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:3000',
    
};

const output = './swaggerDoc.json';
const routes = ['./server.ts'];

swaggerAutogen(output, routes, doc);
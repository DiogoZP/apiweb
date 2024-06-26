import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
      title: 'API Biblioteca',
      description: 'API para gerenciamento de usuários, livros e movimentações em uma biblioteca'
    },
    host: 'localhost:3000',
    
};

const output = './swaggerDoc.json';
const routes = ['./server.ts'];

swaggerAutogen(output, routes, doc);
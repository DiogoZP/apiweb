import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
      title: 'API Biblioteca',
      description: 'API para gerenciamento de usuários, livros e movimentações em uma biblioteca. Todas as requisições aqui listadas e documentadas funcionam somente depois do login. Ao logar um token JWT é gerado e o mesmo é salvo e usado para realizar as demais requisições. '
    },
    host: 'localhost:3000',
    
};

const output = './swaggerDoc.json';
const routes = ['./server.ts'];

swaggerAutogen(output, routes, doc);
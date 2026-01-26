const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({
  url: 'file:./database/database.db',  
});

const prisma = new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('Prisma Query:', {
      query: e.query,
      params: e.params,
      duration: e.duration + 'ms',
    });
  });
}

module.exports = prisma;
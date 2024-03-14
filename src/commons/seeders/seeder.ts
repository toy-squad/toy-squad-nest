import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';

(async () => {
  const seedDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    entities: ['/src/entities/*.entity.{ts,js}'],
    synchronize: true,
    logging: true,
  });

  await seedDataSource.initialize();
  await runSeeders(seedDataSource, {
    seeds: ['/src/commons/seeders/seeds/*.seeds.{ts,js}'],
  });
})();

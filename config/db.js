import { Sequelize } from 'sequelize';
import env from './env';

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: 'mysql',
    logging: false, // disable logging if desired
});

export default sequelize;
module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DBNAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    logging: true,
    pool: {
      maxConnections: Number.MAX_SAFE_INTEGER,
      maxIdleTime: 30000,
      max: 20,
      min: 0,
      idle: 20000,
      acquire: 20000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    dialect: 'postgres',
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DBNAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    logging: true,
    pool: {
      maxConnections: Number.MAX_SAFE_INTEGER,
      maxIdleTime: 30000,
      max: 20,
      min: 0,
      idle: 20000,
      acquire: 20000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DBNAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    dialect: 'postgres',
    pool: {
      maxConnections: Number.MAX_SAFE_INTEGER,
      maxIdleTime: 30000,
      max: 20,
      min: 0,
      idle: 20000,
      acquire: 20000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

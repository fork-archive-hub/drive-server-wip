export default () => ({
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT) || 3000,
  database: {
    host: process.env.RDS_HOSTNAME,
    host2: process.env.RDS_HOSTNAME2,
    host3: process.env.RDS_HOSTNAME3,
    port: parseInt(process.env.RDS_PORT) || 3306,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DBNAME,
    replication: {
      read: [
        {
          host: process.env.RDS_HOSTNAME2,
          username: process.env.RDS_USERNAME,
          password: process.env.RDS_PASSWORD,
        },
        {
          host: process.env.RDS_HOSTNAME3,
          username: process.env.RDS_USERNAME,
          password: process.env.RDS_PASSWORD,
        },
      ],
      write: {
        host: process.env.RDS_HOSTNAME,
        username: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
      },
    },
  },
  secrets: {
    magicIv: process.env.MAGIC_IV,
    magicSalt: process.env.MAGIC_SALT,
    cryptoSecret: process.env.CRYPTO_SECRET,
    cryptoSecret2: process.env.CRYPTO_SECRET2,
  },
  apis: {
    notifications: {
      url: process.env.NOTIFICATIONS_URL,
      key: process.env.NOTIFICATIONS_API_KEY,
    },
    storage: {
      url: process.env.STORAGE_API_URL,
    },
  },
  mailer: {
    host: process.env.INXT_MAILER_HOST,
    port: process.env.INXT_MAILER_PORT,
    username: process.env.INXT_MAILER_USERNAME,
    password: process.env.INXT_MAILER_PASSWORD,
    from: process.env.INXT_MAILER_FROM || 'hello@internxt.com',
    apiKey: process.env.SENDGRID_API_KEY || null,
    templates: {
      sendLinkCreateSender:
        process.env.SENDGRID_TEMPLATE_SEND_LINK_CREATE_SENDER || '',
      sendLinkCreateReceiver:
        process.env.SENDGRID_TEMPLATE_SEND_LINK_CREATE_RECEIVER || '',
    },
  },
});

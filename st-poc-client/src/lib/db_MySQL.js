import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.CLOUD_MYSQL_HOST,
    port: process.env.CLOUD_MYSQL_PORT,
    database: process.env.CLOUD_MYSQL_DATABASE,
    user: process.env.CLOUD_MYSQL_USER,
    password: process.env.CLOUD_MYSQL_PASSWORD
  }
});

export default async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}
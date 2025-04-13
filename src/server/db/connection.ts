import pgp from 'pg-promise';

const connection = pgp()(process.env.DATABASE_URL!); // ! tells ts that it wont be undefined

export default connection;




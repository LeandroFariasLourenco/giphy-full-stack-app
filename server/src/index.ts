import { database } from './core/database';
import APP from './core/express';
import { config } from 'dotenv';
config();

database.initialize()
  .then(() => {
    console.log('The sqlite database is running');
    APP.listen(process.env.PORT, () => {
      console.log('The app is currently running');
    });
  }).catch((error) => console.log(error));

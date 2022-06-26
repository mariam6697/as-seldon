import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as dotenv from 'dotenv';
import { hash } from 'bcrypt';
import pkg from 'mongodb';

const { MongoClient } = pkg;

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL, {
  useUnifiedTopology: true
});

class SetupSeldon {
  static isDatabaseEmpty = async (database) => {
    const usersCollection = await database.collection('users');
    const users = await usersCollection.find().toArray();
    return users.length == 0;
  };

  static createAdmin = async (name, surname, email, password, database) => {
    try {
      const usersCollection = await database.collection('users');
      const hashedPassword = await hash(password, 15);
      await usersCollection.insertOne({
        name,
        surname,
        email,
        password: hashedPassword,
        role: 'admin'
      });
      return `Successfully created admin user with email ${email}`;
    } catch (error) {
      return `An error has occured`;
    }
  };

  static main = async () => {
    await client.connect();
    const db = client.db('as-seldon');
    const databaseEmpty = await this.isDatabaseEmpty(db);
    if (databaseEmpty) {
      const rl = readline.createInterface({ input, output });
      const name = await rl.question('Insert your name: ');
      const surname = await rl.question('Insert your surname: ');
      const email = await rl.question('Insert your email: ');
      const password = await rl.question('Create your password: ');
      const response = await this.createAdmin(name, surname, email, password, db);
      console.log(response);
      rl.close();
    } else {
      console.log('Database is not empty. Please run the server and login');
    }
    await client.close();
  };
}

SetupSeldon.main();

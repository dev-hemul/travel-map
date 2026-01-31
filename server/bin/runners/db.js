import chalk from 'chalk';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  const dbUrl = process.env.DB_URL;

  try {
    await mongoose.connect(dbUrl);

    console.log('\n' + '='.repeat(30));
    console.log(chalk.green.bold('✅ SUCCESS:') + ' Connected to DB');
    console.log(chalk.cyan.bold('📦 Database:') + ' ' + dbUrl);
    console.log('='.repeat(30));
  } catch (err) {
    console.log('\n' + '='.repeat(30));
    console.log(chalk.red.bold('❌ ERROR:') + ' Failed to connect to DB');
    console.log(chalk.yellow('📄 ' + err.message));
    console.log('='.repeat(30));
  }
};

export default connectDB;

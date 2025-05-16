/* eslint-disable prettier/prettier */
import dotenv from 'dotenv';
dotenv.config(); // Vai carregar o .env dentro de transacao, pois o cwd é transacao
console.log('DATABASE_URL:', process.env.DATABASE_URL)
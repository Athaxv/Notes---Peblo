import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
const app = express();
app.get('/', (_, res) => res.send('ok'));
const server = createServer(app);
server.listen(5001, () => console.log('listening 5001'));

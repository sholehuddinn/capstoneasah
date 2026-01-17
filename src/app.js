import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({
  origin: ["https://capstone.web.id"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.options("*", cors());

app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

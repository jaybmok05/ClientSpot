import connectDataBase from './config/database.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';
import userRouters from './routes/userRoutes.js';
import sessionMiddleware from './middleware/sessionMiddleware.js';

/*Connect to database*/
connectDataBase();

/*Load environment variables*/
dotenv.config();
const port = process.env.PORT || 5000;

/*Initialize app*/
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser());


app.use(sessionMiddleware);
/* register user*/
app.use('/api/users', userRouters);

/*Routes*/
app.get('/', (req, res) => res.send('Server is ready'));

/*middleware*/
app.use(notFound);
app.use(errorHandler);


/*Listen to port*/
app.listen(port, () => console.log(`Server started : Port ${port}`))
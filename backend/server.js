import express from 'express';
import dotenv from 'dotenv';

/*Load environment variables*/
dotenv.config();
const port = process.env.PORT || 5000;

/*Initialize app*/
const app = express();

/*Routes*/
app.get('/', (req, res) => res.send('Server is ready'));  

/*Listen to port*/
app.listen(port, () => console.log(`Server started : Port ${port}`))
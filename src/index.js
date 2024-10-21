import express from 'express';
import connectDB from './config/db.js'; 
import uploadRoute from './routes/upload.js'; 
import apiRoute from './routes/api.js'; 
import dotenv from 'dotenv'; 

dotenv.config();

const app = express();
const port = 3000;

connectDB();

app.use(express.json()); 

app.use('/upload', uploadRoute);
app.use('/api', apiRoute); 

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

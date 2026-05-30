import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended: true, limit: '60kb'}));
app.use(express.static("public"));
app.use(cookieParser());

app.get('/', (req, res)=>{res.send("Healthy Server")});

export {app}
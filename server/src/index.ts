import express from "express";
import vhost from 'vhost';
import { env } from "./env";
import dotenv from "dotenv";
import morgan from "morgan";
import { vhostRouter } from "./vhostRouter";


dotenv.config();
const app = express();

app.use(morgan(':req[host] :remote-user :method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());


app.use(vhost(`*.${env('HOST_NAME')}`, vhostRouter));




app.listen(env('PORT'), () => {
    console.log('Server Listening on PORT '+ env('PORT'))
});
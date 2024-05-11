import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js'
// Helmet helps you secure your Express apps by setting various HTTP headers.
import helmet  from 'helmet';


dotenv.config();
const app = express();


// Set Content Security Policy
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "unsafe-inline"],
          objectSrc: ["'none'"],
          imgSrc: ["'self'"],
        //   upgradeInsecureRequests: [],
        },
      },
  }));

// app.use(
//    helmet.contentSecurityPolicy({
//        directives: {
//            defaultSrc: ['none'],
//            scriptSrc: ['self', 'unsafe-inline'],
//            imgSrc: ["self"],
//            // Add more directives as needed
//        },
//    })
// );


app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/posts', postRoutes);

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL)
   .then(() =>  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
   .catch((error) => console.log(error.message));




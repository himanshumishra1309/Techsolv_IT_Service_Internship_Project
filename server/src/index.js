import dotenv from 'dotenv';
import { app } from './app.js';
import { initQdrant } from './services/initQdrant.js';

dotenv.config({
    path: './env',
    
})

initQdrant()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server Running on port " + (process.env.PORT || 8000));
    });
  })
  .catch((err) => {
    console.error("Qdrant initialization failed", err);
  });
disclaimer this project has really really really bad code so please dont tell me that constructive criticism is welcome though its also kinda unfinished and buggy probably and definitely not the most secure thing in the world but hey it works

server code is at theotherhades/peer-backend

## Setup the frontend

1. Make sure you have Node.js installed on your system (version 20.2.0 or higher)

   You can check your Node.js install with `node --version` in the commandline.

2. In your terminal, cd into the downloaded and unzipped directory of the frontend project, and then run `npm i` to install dependencies, and then run `npm run dev` in the same directory to start the app.

3. Go to `localhost:5173` in your browser (or whatever address is shown in the terminal). You should see the application landing page.

## Setup the database

1. This can really be done with any service that provides MongoDB hosting, but I would recommend MongoDB Atlas as it is free. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/), sign up, and create a new cluster.

3. Go to the 'Browse collections' page and create a database `test` if it does not already exist and create two collections in it: `chats` and `users`, each with a single document containing the following data:
   ```json
   {
      "_id": "a"
   }
   ```

4. Save any changes you've made.

## Setup the backend

1. Make sure you have Python installed on your system (version 3.11.3 or higher)

   You can check your Python install with `python3 --version` in the commandline.

2. In your terminal, cd into the downloaded and unzipped directory of the backend project, and then run `pip install -r requirements.txt` to install dependencies.

3. Create a file called `db-url.txt` and paste the database URL for the MongoDB cluster into it. You can get this by clicking 'Connect', clicking 'Drivers', and then copying the URL from the 'Add your connection string into your application code' field.

4. You can check the API is working by going to `localhost:8000` in your browser.

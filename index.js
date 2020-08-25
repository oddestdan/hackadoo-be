const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const bodyParser = require('body-parser');
const cors = require('cors');

const {port: serverPort} = config.get('webServer');
const mongoURI = config.get('mongoURI');
const registrationRouter = require('./server/api/auth/registration');
const loginRouter = require('./server/api/auth/login');
const userRouter = require('./server/api/routes/user');

const start = async () => {
    try {
        await mongoose.connect(mongoURI,
          {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
          },
        );
        console.log('Data base connected')
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
};

start();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({extended: true}));

app.use('/api', registrationRouter);
app.use('/api', loginRouter);
app.use('/api', userRouter);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || serverPort;

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }

    console.log(`server is listening on ${port}`);
});

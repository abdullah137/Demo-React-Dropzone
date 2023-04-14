const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(
	cors({
	  origin: true,
	  methods: ['POST', 'GET', 'DELETE', 'OPTIONS', 'PUT'],
	  credentials: true,
	  maxAge: 3600,
	})
);

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});


app.post('/upload', async(req, res, next) => {

  const images = req.body.images;
  
  // const images = req.body.images[0];

  // const response = await cloudinary.uploader.upload(images.buffer, { folder: 'abdullah-tutorial' });

  //  res.send(response);
  try {
    let promises = [];
  images.forEach(async image => {
    promises.push(
      cloudinary.uploader.upload(image.buffer, {
        folder: 'abdullah'
      })
    )
  });

  const response = await Promise.all(promises);

  console.log(response);
  res.send(response);
  }catch(error) {
    console.log(error);
  }
  
});

app.use('/api', require('./routes/api.route'));



app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

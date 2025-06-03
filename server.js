require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const createAdminUser = require('./controllers/userController').createAdminUser;

mongoose.connect(process.env.MONGO_URI)
  .then(async() => {
    await createAdminUser();
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));

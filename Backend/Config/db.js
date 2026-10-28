const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected Successfully');
    return true;
  } catch (err) {
    console.log('Local MongoDB not detected - Running with built-in seeded datastore so all APIs work out-of-the-box.');
    return false;
  }
};

module.exports = connectDB;

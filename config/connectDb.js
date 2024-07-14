
const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB() {
    try {
        // console.log("-------",process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI);

        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
        });

        mongoose.connection.on('error', (error) => {
            console.log('Error in MongoDB connection:', error);
        });
        
    } catch (error) {
        console.log('Something is wrong in connection', error);
    }
}

module.exports = connectDB;

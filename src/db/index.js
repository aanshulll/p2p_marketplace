const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const connectDB = async () => {
    try {
        const connecting = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`\n MongoDB OK - DB HOST: ${connecting.connection.host}`);
    } catch (error) {
        console.log("Error", error);
        process.exit(1);
    }
};

module.exports = connectDB;

const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./db/index");

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 5050;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB Connection Error:", err);
    });

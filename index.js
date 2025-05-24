require('dotenv').config();

const app = require('./server');
const PORT = process.env.PORT || 8080;
const connectDB = require('./db/config');

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
    process.exit(1);
});

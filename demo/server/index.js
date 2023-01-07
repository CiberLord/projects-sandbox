require('dotenv').config();

const { app } = require('./app');

app.listen({ port: process.env.PORT, host: process.env.HOST }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});

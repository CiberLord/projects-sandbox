const { app } = require('./app');

app.listen({ port: process.env.PORT, host: process.env.HOST }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});

if (process.env.NODE_ENV === 'test') {
    setTimeout(() => {
        process.exit(0);
    }, parseInt(process.env.LIFE_TIME));
}

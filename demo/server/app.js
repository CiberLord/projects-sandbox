const path = require('node:path');
const fastifyFactory = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyAccepts = require('@fastify/accepts');
const fastifyRawBody = require('fastify-raw-body');
const { registerPageRoutes } = require('./routes/pages/registerPageRoutes');

const app = fastifyFactory({
    logger: true,
});

app.register(fastifyRawBody, {
    field: 'rawBody',
    global: false,
    encoding: false,
    runFirst: true,
    routes: [],
});

app.register(fastifyAccepts);

app.register(fastifyStatic, {
    root: path.join(__dirname, '../dist'),
    prefix: '/',
});

registerPageRoutes(app);

module.exports = {
    app,
};

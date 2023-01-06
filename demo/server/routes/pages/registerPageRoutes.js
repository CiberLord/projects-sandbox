const fs = require('node:fs');
const path = require('node:path');

const { routes } = require('./config');
const composeBaseData = require('./composeBaseData');

const htmlPath = path.resolve(process.cwd(), 'dist/index.html');

let html = fs.readFileSync(htmlPath, {
    encoding: 'utf8',
});

const registerPageRoutes = (app) => {
    routes.forEach(({ path, controller }) => {
        app.route({
            method: 'GET',
            url: path,
            handler: async function (request, reply) {
                const data = {};

                controller(request, composeBaseData(request, data));

                if (request.query.spa) {
                    reply.type('application/json');
                    reply.send({
                        data,
                    });
                }

                html = html.replace('window.__INITIAL_STATE__ = null', `window.__INITIAL_STATE__ = ${JSON.stringify(data)}`);

                reply.type('text/html');
                reply.send(html);
            },
        });
    });
};

module.exports = {
    registerPageRoutes,
};

const config = require('./controllers/config-data');

const composeBaseData = (request, data) => {
    return config(request, data);
};

module.exports = composeBaseData;

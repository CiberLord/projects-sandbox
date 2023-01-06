const configData = (req, data) => {
    return (data.config = {
        host: req.hostname,
        url: req.url,
    });
};

module.exports = configData;

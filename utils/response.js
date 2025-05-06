const response = (statusCode, data, message, res) => {
    res.send(statusCode, [
        {
            payload: data,
            message,
            success,
            metadata: {
                prev: '',
                next: '',
                current: '',
            },
        },
    ]);
};

module.exports = response;

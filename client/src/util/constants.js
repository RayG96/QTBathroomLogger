const prod = {
    API_URL: 'https://qt-logger.onrender.com',
};
const dev = {
    API_URL: 'http://localhost:5000',
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
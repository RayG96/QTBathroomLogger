const prod = {
    API_URL: 'https://patient-pine-9259.fly.dev',
};
const dev = {
    API_URL: 'http://localhost:5000',
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
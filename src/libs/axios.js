import {default as Axios} from 'axios';

const axios = Axios.create({
  baseURL: '/api', // base path for your Next.js API routes
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axios;

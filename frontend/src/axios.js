import axios from 'axios';

const server = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 1000,
  headers: {},
});


export default server;
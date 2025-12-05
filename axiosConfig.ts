import axios from 'axios';
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 500 || error.response.status === 429)) {

      return Promise.reject(null);
    }
    return Promise.reject(error);
  }
);

export default axios;

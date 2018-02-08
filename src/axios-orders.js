import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://my-react-db.firebaseio.com/'
});

export default instance;
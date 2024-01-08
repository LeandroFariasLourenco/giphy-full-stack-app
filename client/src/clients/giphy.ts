import axios from "axios";

const Giphy = axios.create({
  baseURL: 'https://api.giphy.com/v1/gifs',
  params: {
    api_key: process.env.REACT_APP_GIPHY_API_KEY
  }
});

export default Giphy;

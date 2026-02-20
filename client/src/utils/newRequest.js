import axios from "axios";

const newRequest = axios.create({
    baseURL : "https://test-he8p.onrender.com/api/",
    withCredentials : true
})

export default newRequest

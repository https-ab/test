import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import newRequest from "../../utils/newRequest";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
      e.preventDefault();
      try{
          // const res = await axios.post('http://localhost:4000/api/auth/login', {
          //   username, password
          // }, {
          //   withCredentials : true
          // })

          const res = await newRequest.post('auth/login',{username , password}, {withCredentials: true})
          console.log('Login Sucessfull')
          console.log(res.data)

          localStorage.setItem('currentUser', JSON.stringify(res.data))
          console.log('User data stored in localStorage')

          
          navigate('/')
      }catch(err){
        setError(err.message)
        console.log(err.message)
      }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && error}

        <Link to="/forget-password">Forget Password</Link>
      </form>

      
    </div>
  );
}

export default Login;
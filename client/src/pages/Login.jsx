import  { useState } from 'react'
import axios from 'axios'
const Login = () => {
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const [ , setErr] = useState('')

    async function handleChange(e){
        e.preventDefault();

        try{
            const res = await axios.post('http://localhost:4000/api/auth/login' , {username , password}, {withCredentials: true})
            console.log(res)
        }
        catch(err){
            setErr(err)
            console.log(err.message)
        }
    }

  return (
    <div className='login'>
      <form onSubmit={handleChange}>
        <h1>Sign in</h1>
        <label>Username</label>
        <input type="text" name='username' placeholder='johndoe' onChange={(e) => setUsername(e.target.value)} />

        <label>Password</label>
        <input type="text" name="password" onChange={(e) => setPassword(e.target.value)} />

        <button type='submit'>Login</button>

      </form>
    </div>
  )
}

export default Login
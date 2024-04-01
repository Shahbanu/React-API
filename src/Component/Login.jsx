import './Login.css'
import { FaArrowRightLong } from "react-icons/fa6";
import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const LoginApi = () => {

  const [email, setEmail] = useState('');
  const navigate =useNavigate()
  const [password, setPassword] = useState('');
  const [ , setIsLoggedIn] = useState(false);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('https://testapi.mair.co.ae/api/auth/login', {
      email: email,
      password: password
    })
    .then((res) => {
      // console.log(res.data.authorisation.token);
        //check if the response contains a token
      if(res.data.authorisation.token){
        //store the token in the local storage
        localStorage.setItem('token', res.data.authorisation.token); 
        localStorage.setItem('user',JSON.stringify(res.data.user))
        console.log(res?.data.user);
        navigate('/Table')
        //update isLoggedIn state
        setIsLoggedIn(true)
        // history.push('/Table');
      }else{
        //handle cases no token is returned
        console.log('No token received');
      }
    })
    .catch((error) => {
      console.error('Error:',error);
      alert('Invalid email or password');
    });
  };
  return (
    <div className='container'>
        <form onSubmit={handleSubmit} className="formMenu">
        <h1 className="head1">Login to Your Account</h1>
              <input
               type="email"
               placeholder="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
              />
              <br></br>
            <input
              type="password"
              placeholder="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <br></br>

            <button  type="submit" className="login-button" >
            Login to Your Account
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
           <FaArrowRightLong />
           </button>

              <div className="forgot-password">
            <a href="forgot">Forgot Password?</a>
          
          <a href="register">Register</a>
          </div>
        </form>
      </div>
  );
};

export default LoginApi;

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Path } from 'react-router-dom';
import { Register } from './components/register';
import { Login } from './components/login';
import { Home } from './components/home';
import { CreateTransaction } from './components/createTransaction';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();


function App() {

  const [logged, setLogged] = useState(false);
  // const token = localStorage.getItem('token');
  // if(token) setLogged(true);
  
  const isAuth = async() =>{
    try {
      
      const response = await axios.get('http://localhost:3001/is-verify',{
      headers:{token: localStorage.getItem('token')}
    })
    console.log(response.data);
    
     response.data === true ? setLogged(true) : setLogged(false);
    } catch (error) {
      console.error(error);
     
    }
  }

  useEffect( () =>{

     isAuth();

  },[]);

  return(
  <Routes>
    
    <Route path='/login' element={!logged ? <Login setLogged={setLogged}/> : <Navigate to='/home'/>}/>
    <Route path='/register' element={!logged ? <Register setLogged={setLogged}/> : <Navigate to='/home'/>}/>
    <Route path='/home' element={logged ? <Home setLogged={setLogged}/> : <Navigate to='/login'/>}/>
    <Route path='/create-transaction' element={logged ? <CreateTransaction /> : <Navigate to='/login'/>}/>
  </Routes>
  )
}

export default App;

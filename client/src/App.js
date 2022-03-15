import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './components/register';
import { Login } from './components/login';
import { Home } from './components/home';

function App() {
  const [logged, setLogged] = useState(false);
  // const token = localStorage.getItem('token');
  // if(token) setLogged(true);
  return(
  <Routes>
    <Route path='/login' element={!logged ? <Login setLogged={setLogged}/> : <Navigate to='/home'/>}/>
    <Route path='/register' element={!logged ? <Register setLogged={setLogged}/> : <Navigate to='/home'/>}/>
    <Route path='/home' element={logged ? <Home setLogged={setLogged}/> : <Navigate to='/login'/>}/>
  </Routes>
  )
}

export default App;

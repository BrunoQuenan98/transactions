import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";


const validateErrors = (inputs) =>{
    let errors = {};
    if(!inputs.email)errors.email = 'Field required';
    if(!inputs.password)errors.password = 'Field required';
    return errors;
}

export const Register = ({setLogged}) =>{
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({email:'', password:''});
    const [errors, setErrors] = useState(validateErrors(inputs))

    const handleInputChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value});
        setErrors(validateErrors({...inputs, [e.target.name] : e.target.value}));
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(e.target.name === "login"){
            const request = await axios.post('http://localhost:3001/login',inputs);
            if(request.data.token){
                const token = request.data.token;
                localStorage.setItem('token', token);
                setLogged(true);
                navigate('/home');
            }else{
                // setInputs({email:'', password:''});
                // setErrors(validateErrors({email:'', password:''}));
                alert(request.data);
            }
        }else{
            const request = await axios.post('http://localhost:3001/register',inputs);
            if(request.data.token){
                const token = request.data.token;
                localStorage.setItem('token', token);
                setLogged(true);
                navigate('/home');
            }else{
                // setInputs({email:'', password:''});
                // setErrors(validateErrors({email:'', password:''}));
                alert(request.data);
            }
        }
    }

    return(<>
    <div>
        <div>
            <label>Email address</label>
            <input type="email" name="email" value={inputs.email} onChange={(e) => handleInputChange(e)}/>
            {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
            <label>Password</label>
            <input type="password" name="password" value={inputs.password} onChange={(e) => handleInputChange(e)}/>
            {errors.password && <span>{errors.password}</span>}
        </div>
        <button type="submit" name="login" onClick={(e) => handleSubmit(e)}>Login</button>
        <button type="submit" name="submit" onClick={(e) => handleSubmit(e)}>Register</button>
    </div>

    </>)
}
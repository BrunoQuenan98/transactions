import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const validateErrors = (inputs) =>{
    let errors = {};
    if(!inputs.email)errors.email = 'Field required';
    if(!inputs.password)errors.password = 'Field required';
    return errors;
}

export const Register = ({setLogged}) =>{

    const [inputs, setInputs] = useState({email:'', password:''});
    const [errors, setErrors] = useState(validateErrors(inputs))

    const handleInputChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value});
        setErrors(validateErrors({...inputs, [e.target.name] : e.target.value}));
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/register',inputs);
            if(response.data.token){
            localStorage.setItem('token', response.data.token);
            setLogged(true);
            toast.success('Register successfully');
            }else{
            toast.error(response.data);    
            }
        } catch (e) {
            console.error(e.message);
            
        }
    }

    return(<>
        <form onSubmit={(e) => handleSubmit(e)}>
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
        <button type="submit" name="submit" disabled={Object.keys(errors).length ? true : false}>Create</button>
        </form>
    </>)
}
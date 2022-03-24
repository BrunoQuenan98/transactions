import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import s from './login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";


const validateErrors = (inputs) =>{
    let errors = {};
    if(!inputs.email)errors.error = `Some field it's missing`;
    if(!inputs.password)errors.error = `Some field it's missing`;
    return errors;
}

export const Login = ({setLogged}) =>{

    const [inputs, setInputs] = useState({email:'', password:''});
    const [errors, setErrors] = useState(validateErrors(inputs))

    const handleInputChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value});
        setErrors(validateErrors({...inputs, [e.target.name] : e.target.value}));
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login',inputs);
            if(response.data.token){
            localStorage.setItem('token', response.data.token);
            setLogged(true);
            toast.success('Login successfully');
            }else{
                toast.error(response.data)
            }
        } catch (e) {
            console.error(e.message);
        }
    }


    return(<div className={s.conteiner}>
        <h1>Log<span className={s.letter}>in</span></h1>
        <form onSubmit={(e) => handleSubmit(e)} className={s.form}>
        <div>
        <div className={s.emailConteiner}>
            <div className={s.iconConteiner}>
         <FontAwesomeIcon icon={faEnvelope} className='fa-camera fa-xl'/>
         </div>
            <input autoComplete="off" type="email" name="email" className={s.input} placeholder="Email" value={inputs.email} onChange={(e) => handleInputChange(e)}/>
        </div>
        <div className={s.passwordConteiner}>
        <div className={s.iconConteiner}>
        <FontAwesomeIcon icon={faKey} className='fa-key fa-xl'/>
        </div>
            <input type="password" className={s.input} placeholder="Password" name="password" value={inputs.password} onChange={(e) => handleInputChange(e)}/>
        </div>
         {errors.error && <span>{errors.error}</span>}
        </div>
        <div className={s.btnSubmitConteiner}>
        <button className={s.btnSubmit} type="submit" name="submit" disabled={Object.keys(errors).length ? true : false}>{<FontAwesomeIcon icon={faArrowRightToBracket} className='faArrowRightToBracket fa-xl'/>}</button>
        </div>
        </form>
        <Link to='/register'>
            If you dont have an account click here!
        </Link>
    </div>)
}
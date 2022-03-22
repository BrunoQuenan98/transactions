import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import s from './createTransaction.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

const validateErrors = (inputs) =>{
    let errors = {};
    if(!inputs.concept)errors.concept = 'Field required';
    if(!inputs.amount){
        errors.amount = 'Field required';
    // }else if(Number.isNaN(Number(inputs.amount))){
    //     errors.amount = 'Only numbers can be included';
        }
    if(!inputs.date)errors.date = 'Field required';
    if(!inputs.type)errors.type = 'Field required';
    return errors;
}

export const CreateTransaction = () =>{
    
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({concept:'', amount:'', date:'', type:'ingreso'});
    const [errors, setErrors] = useState(validateErrors(inputs));

    const handleInputChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value});
        setErrors(validateErrors({...inputs, [e.target.name] : e.target.value}));
    }

    const handleSubmit= async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/transactions',inputs,{
                headers:{token : localStorage.token}
            })
            if(response.data.concept){
                toast.success('Transaction created');
                navigate('/home');
            }else{
                toast.error(response.data);
            }
            
            console.log(response.data);
        } catch (e) {
            console.error(e.message);
        }
       
    }

    return(<>
        <form onSubmit={e => handleSubmit(e)} className={s.conteiner}>
        
            <div className={s.content}>
            
            
            <h1 className={s.title}>Create Transaction</h1>
            
        <div className={s.inputConteiner}>
            <label className={s.label}>Concept</label>
            <input maxlength="30" className={errors.concept ? s.inputTextError : s.inputText} type="text" name="concept" value={inputs.concept} onChange={(e) => handleInputChange(e)}/>
            {errors.concept && <span className={s.errors}>{errors.concept}</span>}
        </div>
        <div className={s.inputConteiner}>
            <label className={s.label}>Amount</label>
            <input className={errors.amount ? s.inputTextError : s.inputText} type="text" name="amount" value={inputs.amount} onChange={(e) => handleInputChange(e)}/>
            {errors.amount && <span className={s.errors}>{errors.amount}</span>}
        </div>
        <div className={s.inputConteiner}>
            <label className={s.label}>Date</label>
            <input className={errors.date ? s.inputDateError : s.inputDate} type="date" name="date" value={inputs.date} onChange={(e) => handleInputChange(e)}/>
            {errors.date && <span className={s.errors}>{errors.date}</span>}
        </div>
        <div className={s.inputConteiner}>
            <label className={s.label}>Type</label>
            <select className={errors.type ? s.inputTypeError : s.inputType} name="type" onChange={(e) => handleInputChange(e)}>
                <option name="ingreso"  value="ingreso">Ingress</option>
                <option name="egreso" value="egreso">Egress</option>
            </select>
            {errors.type && <span className={s.errors}>{errors.type}</span>}
        </div>
        <div className={s.footer}>
        <button type="submit" className={s.submit} name="submit" disabled={Object.keys(errors).length ? true : false}><FontAwesomeIcon icon={faPlus} /> Create</button>
        <Link to='/home' className={s.linkIcon}>  
        <span>Home</span>
        </Link>
        </div> 
        </div>
        </form>
    </>)

}
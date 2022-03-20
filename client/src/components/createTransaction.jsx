import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import s from './createTransaction.module.css';

const validateErrors = (inputs) =>{
    let errors = {};
    if(!inputs.concept)errors.concept = 'Field required';
    if(!inputs.amount)errors.amount = 'Field required';
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
        <div className={s.inputConteiner}>
            <label>Concept</label>
            <input maxlength="30" className={s.inputText} type="text" name="concept" value={inputs.concept} onChange={(e) => handleInputChange(e)}/>
            {errors.concept && <span className={s.errors}>{errors.concept}</span>}
        </div>
        <div className={s.inputConteiner}>
            <label>Amount</label>
            <input className={s.inputText} type="text" name="amount" value={inputs.amount} onChange={(e) => handleInputChange(e)}/>
            {errors.amount && <span className={s.errors}>{errors.amount}</span>}
        </div>
        <div className={s.inputConteiner}>
            <label>Date</label>
            <input className={s.inputDate} type="date" name="date" value={inputs.date} onChange={(e) => handleInputChange(e)}/>
            {errors.date && <span className={s.errors}>{errors.date}</span>}
        </div>
        <div className={s.inputConteiner}>
            <label>Type</label>
            <select className={s.inputType} name="type" onChange={(e) => handleInputChange(e)}>
                <option name="ingreso"  value="ingreso">Ingress</option>
                <option name="egreso" value="egreso">Egress</option>
            </select>
            {errors.type && <span className={s.errors}>{errors.type}</span>}
        </div>

        <button type="submit" name="submit" disabled={Object.keys(errors).length ? true : false}>Create</button>
        </div>
        </form>
    </>)

}
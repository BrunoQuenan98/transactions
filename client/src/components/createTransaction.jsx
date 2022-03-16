import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        <form onSubmit={e => handleSubmit(e)}>
        <div>
            <label>Concept</label>
            <input type="text" name="concept" value={inputs.concept} onChange={(e) => handleInputChange(e)}/>
            {errors.concept && <span>{errors.concept}</span>}
        </div>
        <div>
            <label>Amount</label>
            <input type="text" name="amount" value={inputs.amount} onChange={(e) => handleInputChange(e)}/>
            {errors.amount && <span>{errors.amount}</span>}
        </div>
        <div>
            <label>Date</label>
            <input type="date" name="date" value={inputs.date} onChange={(e) => handleInputChange(e)}/>
            {errors.date && <span>{errors.date}</span>}
        </div>
        <div>
            <label>Type</label>
            <select name="type" onChange={(e) => handleInputChange(e)}>
                <option name="ingreso"  value="ingreso">Ingress</option>
                <option name="egreso" value="egreso">Egress</option>
            </select>
            {errors.type && <span>{errors.type}</span>}
        </div>

        <button type="submit" name="submit" disabled={Object.keys(errors).length ? true : false}>Create</button>
        </form>
    </>)

}
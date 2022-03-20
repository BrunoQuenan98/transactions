import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import s from './card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCircleXmark } from '@fortawesome/free-solid-svg-icons';


const validateErrors = (atributtes) =>{
    let errors = {}
    if(!atributtes.amount)errors.amount = 'Fiel required';
    if(!atributtes.date)errors.date = 'Fiel required';
    if(!atributtes.concept)errors.concept = 'Fiel required';
    return errors;
}

export const Card = ({removed, setRemoved, transaction}) =>{
    const { amount, type, concept, date } = transaction;
    const [atributtes, setAtributtes] = useState({amount, date, concept});
    const [errors, setErrors] = useState(validateErrors(atributtes));

    const handleInputChange = (e) =>{
        setAtributtes({...atributtes, [e.target.name] : e.target.value});
        setErrors(validateErrors({...atributtes, [e.target.name] : e.target.value}));
    }

    const handleRemove = async (id) =>{
        try {
            const response = await axios.delete(`http://localhost:3001/transactions/${id}`,{
                headers:{ token : localStorage.token }
            });
            if(response.data.removed){
                removed ? setRemoved(false) : setRemoved(true);
                toast.success(`The transaction with id:${id} was removed`);
            }
        } catch (e) {
            toast.error('Ups! Error removing transaction. Try later')
            console.error(e.message);
        }
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/transactions/${transaction.id}`,atributtes,{
            headers:{ token : localStorage.token }
        });
        removed ? setRemoved(false) : setRemoved(true);
        toast.success(`The transaction with id:${transaction.id} was modificated`);
        } catch (error) {
            console.error(error.message);
        }
        
        
    }

    return(<div className={s.conteiner}>
        <form onSubmit={(e) => handleSubmit(e)}>
        {transaction.type && type === 'ingreso' ? '🟢' : '🔴' }
        <input type='text' className={s.input} name="amount" onChange={e => handleInputChange(e)} value={atributtes.amount}/>
        <input type='concept' className={s.input} name="concept" onChange={e => handleInputChange(e)} value={atributtes.concept}/>
        <input type='date' className={s.input} name="date" onChange={e => handleInputChange(e)} value={atributtes.date}/>
        <button type='submit' className={s.input} disabled={Object.keys(errors).length ? true : false}>{<FontAwesomeIcon icon={faPenToSquare} />}</button>
        </form>
        <button onClick={() => handleRemove(transaction.id)}><FontAwesomeIcon icon={faCircleXmark} /></button>
    </div>)
}
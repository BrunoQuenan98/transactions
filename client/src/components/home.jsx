import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from './card';
import s from './home.module.css'

export const Home = ({setLogged}) =>{
     
     const [allTransactions, setAllTransactions] = useState([])
     const [balance, setBalance] = useState(0);
     const [removed, setRemoved] = useState(false);
     
     const getTransactions = async ()=>{
        try{
        const token = localStorage.getItem('token');
        const transactions = await axios.get('http://localhost:3001/transactions', {
            headers: { token }
        })
        setAllTransactions(transactions.data);
        }catch(e){
            console.log(e.message);
        }
    }
    const getBalance = async() =>{
        try {
            const response = await axios.get('http://localhost:3001/balance',{
            headers : { token : localStorage.token}
        })
            setBalance(response.data);
        } catch (error) {
            console.error(error.message);
        }
        
    }

    useEffect(() =>{
        getTransactions();
        getBalance();
    },[])

    useEffect(() =>{
        getTransactions();
        getBalance();
    },[removed])

  

    const handleLogout = () =>{
        localStorage.removeItem("token");
        setLogged(false);
        console.log(toast);
        toast('Bye bye!')
    }
    const handlePostTransaction = async() =>{
        
    }

    return(<div className={s.conteiner}>
        <Link to='/create-transaction'>
        <button onClick={handlePostTransaction}>Create transaction</button>
        </Link>
        <button className={s.logout} onClick={handleLogout}>Logout</button>
        <h1>{balance}</h1>
        {allTransactions.length ? allTransactions.map(t => <Card removed={removed} setRemoved={setRemoved} transaction={t}/>) : <span>No hay transacciones</span>}
    </div>)
}
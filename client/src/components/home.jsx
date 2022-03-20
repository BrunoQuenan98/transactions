import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from './card';
import s from './home.module.css';
import { Navbar } from "./navbar";

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
    

    return(<div className={s.conteiner}>
        <Navbar handleLogout={handleLogout}/>
        <div className={s.bodyConteiner}>
        <div className={s.headerConteiner}>
        <span className={s.title}>Hi, Bruno!</span>
        <span className={s.balance}>Your balance: <span className={balance >= 0 ? s.valueBalancePos : s.valueBalanceNeg}>${balance}</span></span>
        </div>
        {allTransactions.length ?<div className={s.cardConteiner}>{allTransactions.map((t,i) =><Card id={t.id} name={t.id} key={i}removed={removed} setRemoved={setRemoved} transaction={t}/>)}</div>  : <span>No hay transacciones</span>}
        </div>
    </div>)
}
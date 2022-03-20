import React from 'react';
import { Link } from 'react-router-dom';
import s from './navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';


export const Navbar = ({handleLogout}) => {
  return (
    <nav className={s.navbar}>
        <Link to='/create-transaction' className={s.link}>
        <button className={s.btnCreate}>Create transaction</button>
        </Link>
        <button className={s.logout} onClick={handleLogout}><FontAwesomeIcon icon={faArrowRightToBracket} className='faArrowRightToBracket fa-xl'/></button>
        </nav>
  )
}



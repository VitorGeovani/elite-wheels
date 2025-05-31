import './menu.scss'
import logo from '../../../assets/logo.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LateralMenu() {
    return (
        <div className='MainMenu'>
            <div className='content'>
                <div className='imgEx'>
                    <img src={logo} />
                    <h3>Elite<span>Wheels</span></h3>
                </div>

                <div className='options' >
                    <Link to='/'>
                        <div id='selected' >
                            <i className="fa-solid fa-house"></i>
                            <span>Home</span>
                        </div>
                    </Link>

                    <Link to='/clients'>
                        <div id='selected'>
                            <i className="fa-solid fa-user"></i>
                            <span>Clientes</span>
                        </div>
                    </Link>
                    <Link to='/cars'>
                        <div id='selected'>
                            <i className="fa-solid fa-car-rear"></i>
                            <span>Veiculos</span>
                        </div>
                    </Link>
                    <Link to='/location'>
                        <div id='selected'>
                            <i className="fa-solid fa-key"></i>
                            <span>Locação</span>
                        </div>
                    </Link>
                </div>
            </div>  
        </div>
    )
}
import React from 'react'
import Logo from '../../Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems'
import './SideDrawer.css'
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Au/Aux'

const sideDrawer = (props) => {
    let classFOrBd = props.open ? "SideDrawer Open" : "SideDrawer Close"
    return (
        <Aux><div className="Back">
            <Backdrop show = {props.open} clicked = {props.closed}/>
        </div>
         
        <div className= {classFOrBd}>
        
            <Logo height="11%" />
                     
            <nav>
                <NavigationItems/>
            </nav>
        </div>
        </Aux>
    )
}

export default sideDrawer
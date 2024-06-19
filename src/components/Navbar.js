import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
        <div id='navbar'>
            <Link to="/openings">Openings Database</Link>
            <Link to="/training">Training</Link>
        </div>
        <Outlet />
    </>
  )
}

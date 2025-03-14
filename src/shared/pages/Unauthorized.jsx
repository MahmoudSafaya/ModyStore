import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Unauthorized = () => {
  const { auth } = useAuth();

  return (
    <div>
      <h2>unauthorized</h2>
      <Link to='/'>Back Home ➡️</Link>
      {auth.role === 'admin'
        ? <Link to='/'>Back Home ➡️</Link>
        : <Link to='/place-order'>Back Home ➡️</Link>}
    </div>
  )
}

export default Unauthorized
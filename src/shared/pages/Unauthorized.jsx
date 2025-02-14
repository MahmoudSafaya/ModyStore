import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div>
        <h2>unauthorized</h2>
        <Link to='/'>Back Home ➡️</Link>
    </div>
  )
}

export default Unauthorized
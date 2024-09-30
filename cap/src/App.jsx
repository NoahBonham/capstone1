import Navbar from './components/navbar'
import Register from './components/register'
import Login from './components/login'
import Account from './components/account'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { useState } from 'react'

function App() {

  const [token, setToken] = useState('')


  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/register' element={<Register 
        setToken={setToken}/>}/>
        <Route path='/login' element={<Login 
        setToken={setToken}/>}/>
        <Route path='/account' element={<Account />}/>
      </Routes>

    </>
  )
}

export default App

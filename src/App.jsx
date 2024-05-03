import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Single from './components/Single'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={ <Layout/> }>
            <Route index element={ <Home/> } />
            <Route path='/Single' element={ <Single/> } />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App

import { useState } from 'react'
// import Navbar from "./components/Navbar"
// import Welcome from "./components/Welcome";

import logo from './logo.svg'
// import './App.css'
import { Navbar, Welcome, Footer, Services, Transactions } from "./components/index";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen">

      <div className="gradient-bg-welcome">

        <Navbar/>
        <Welcome/>
      </div>


      <Services/>
      <Transactions/>
      <Footer/>
    </div>
  )
}

export default App;

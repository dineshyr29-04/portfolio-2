import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const handleadd=()=>{
    setCount(prevCount=>prevCount+1);
  }
  const handlesub= () =>{
    setCount(prevCount=>prevCount-1);
  }
  const handleReset=()=>{
    setCount(0);
  }
  return (
    <>
      <div className='main-container'>
        <div className='inner-container'>
          <h1>Counter</h1>
          <p>Current Count</p>
          <p className='count'>{count}</p>
          <div>
            <button className='add-btn' onClick={handleadd}> 
              +
            </button>
            <button className="minus-btn" onClick={handlesub}>
              -
            </button>
          </div>
          <button className='reset-btn' onClick={handleReset}>Reset</button>

        </div>
      </div>
    </>
  )
}

export default App

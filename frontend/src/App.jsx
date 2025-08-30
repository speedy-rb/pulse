import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState('')

  useEffect( () => {
    fetch("/api/index")
      .then((r) => {
        console.log(r);
        return r.json();
      })
      .then((d) => {
        console.log(d);
        return setMsg(d.message);
      })
      .catch(console.error);
  }, []);

  return <h1>
    {msg || "Loading..."}
  </h1>

}

export default App

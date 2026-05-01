import { useState, useEffect } from "react";
import Myapp from './components/Myapp';
import LoginScreen from './components/LoginScreen/LoginScreen';

function App() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    async function checkSession() {
      const res = await fetch('/api/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    }
    checkSession();
  }, []);
  if (user === null) {
    return <LoginScreen setUser={setUser} />;
  }
  return <Myapp setUser={setUser} />
}

export default App
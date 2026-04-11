import Myapp from './components/Myapp';
import { Outlet } from "react-router-dom";
import PostForm from './components/PostForm/PostForm';

function App() {
  return <>
    <PostForm />
    {/* <Myapp /> */}
  </>
}

export default App
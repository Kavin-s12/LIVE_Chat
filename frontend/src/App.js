import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} exact></Route>
        <Route path='/chats' element={<Chat />}></Route>
      </Routes>
    </div>
  );
}

export default App;

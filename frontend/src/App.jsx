import './App.css'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import CreateTask from './components/CreateTask'
import TaskList from './components/TaskList' 

function App() {

  return (
    <>
      
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/tasks' element={<TaskList />} />
          <Route path='/create' element={<CreateTask />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      
    </>
  )
}

export default App

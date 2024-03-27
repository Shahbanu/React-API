

import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from "./Component/Login"
import Table from './Component/Table'
function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/> }/>
      <Route path='/Table' element={<Table/>}/>

    </Routes>
    
        </BrowserRouter>
  )
}

export default App

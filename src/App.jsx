/* eslint-disable no-unused-vars */
import {Box} from '@mui/material'
import './App.css'
import Form from './Components/Form'
import ViewRecipe from './Components/ViewRecipe'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Box>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/viewrecipe" element={<ViewRecipe />} />
        </Routes>
      </Router>
    </Box>
  )
}

export default App

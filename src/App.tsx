import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import Home from './components/Home';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<SignIn/>}/>
          <Route path='/home' element = {<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

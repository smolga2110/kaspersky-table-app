import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import Groups from './pages/Groups';
import Header from './components/common/Header';


function App() {
  return (
    <>
      <Header/>
      <main>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/users' element={<Users/>}/>
          <Route path='/groups' element={<Groups/>}/>
        </Routes>
      </main>
    </>
  );
}

export default App;

import React from 'react';
import './App.css';

import TemplatePage from './template-page'

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <TemplatePage></TemplatePage>
      </div>
    </BrowserRouter>
  );
}

export default App;

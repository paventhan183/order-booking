import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import OrderForm from './OrderForm';
import CartPage from './CartPage'; // Make sure you have this component

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

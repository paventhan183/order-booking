import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OrderForm from './OrderForm';
import CartPage from './CartPage'; // Make sure you have this component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

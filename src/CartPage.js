import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import itemsData from './items.json'; // Make sure this import is present

const CartPage = () => {
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const storedFormData = localStorage.getItem('orderFormData');
    const storedItems = localStorage.getItem('orderFormItems');
    if (storedFormData) setFormData(JSON.parse(storedFormData));
    if (storedItems) setItems(JSON.parse(storedItems));
  }, []);

  const handleSubmit = () => {
    alert('Order submitted successfully!');
    // Optionally clear cart or redirect
  };

  const handleSendWhatsApp = () => {
    // Calculate total
    const total = items.reduce((sum, item) => {
      const itemObj = itemsData.find(i => i.name === item.item);
      const unitPrice = itemObj && item.unit ? itemObj.prices?.[item.unit] ?? 0 : 0;
      const qty = Number(item.quantity) || 0;
      return sum + unitPrice * qty;
    }, 0);

    // Build message with total
    const message = `
*Order Details:*
Name: ${formData.name}
Mobile: ${formData.mobile}
Address: ${formData.address}

*Items:*
${items
  .map((i, idx) => {
    const itemObj = itemsData.find(it => it.name === i.item);
    const unitPrice = itemObj && i.unit ? itemObj.prices?.[i.unit] ?? 0 : 0;
    const qty = Number(i.quantity) || 0;
    const totalPrice = unitPrice * qty;
    return `${idx + 1}. ${i.item} (${itemObj && itemObj.tamil ? itemObj.tamil : ''}) - ${i.quantity} ${i.unit} - ₹${totalPrice ? totalPrice.toFixed(2) : '-'}`
  })
  .join('\n')}
  
*Total Amount:* ₹${total.toFixed(2)}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    console.log(message);
    const phoneNumber = '918015241869'; // Replace with your WhatsApp number
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  const handleChangeOrder = () => {
    // Just navigate back to order form, values are already in localStorage
    navigate('/');
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: '32px 24px'
    }}>
      <h2>Cart</h2>
      <div>
        <strong>Name:</strong> {formData.name}<br />
        <strong>Mobile:</strong> {formData.mobile}<br />
        <strong>Address:</strong> {formData.address}<br /><br />

        <h3>Items</h3>
        <table
  style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    fontFamily: `'Segoe UI', 'Noto Sans Tamil', 'Latha', 'Arial Unicode MS', Arial, sans-serif`
  }}
>
          <thead>
            <tr style={{ background: '#f7fafd' }}>

              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item (Tamil)</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Unit/Quantity</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const itemObj = itemsData.find(i => i.name === item.item);
              const unitPrice = itemObj && item.unit ? itemObj.prices?.[item.unit] ?? 0 : 0;
              const qty = Number(item.quantity) || 0;
              const totalPrice = unitPrice * qty;
              return (
                <tr key={item.id}>

                  <td style={{ border: '1px solid #ccc', padding: '8px' }}> {idx + 1}.{item.item}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {itemObj && itemObj.tamil ? itemObj.tamil : ''}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.quantity} {item.unit}</td>
                
                  <td style={{ border: '1px solid #ccc', padding: '8px', color: '#0078d4', fontWeight: 500 }}>
                    {unitPrice && qty ? totalPrice.toFixed(2) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total row */}
        <div style={{
          textAlign: 'right',
          fontWeight: 600,
          fontSize: 18,
          color: '#0078d4',
          marginBottom: 24
        }}>
          Total:&nbsp;
          {items.reduce((sum, item) => {
            const itemObj = itemsData.find(i => i.name === item.item);
            const unitPrice = itemObj && item.unit ? itemObj.prices?.[item.unit] ?? 0 : 0;
            const qty = Number(item.quantity) || 0;
            return sum + unitPrice * qty;
          }, 0).toFixed(2)}
        </div>

        {/* <button type="button" onClick={handleSubmit} style={{ marginRight: '10px' }}>
          Submit Order
        </button> */}
        <button type="button" onClick={handleSendWhatsApp} style={{ marginRight: '10px' }}>
          Send via WhatsApp
        </button>
        <button type="button" onClick={handleChangeOrder}>
          Change Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
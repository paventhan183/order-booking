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
        <div className="cart-items-list">
          {/* Header for desktop */}
          <div className="cart-header">
            <div className="cart-col" style={{ flex: 3 }}>Item</div>
            <div className="cart-col" style={{ flex: 2, textAlign: 'center' }}>Unit/Quantity</div>
            <div className="cart-col" style={{ flex: 1, textAlign: 'right' }}>Price</div>
          </div>

          {/* Item Rows */}
          {items.map((item, idx) => {
            const itemObj = itemsData.find(i => i.name === item.item);
            const unitPrice = itemObj && item.unit ? itemObj.prices?.[item.unit] ?? 0 : 0;
            const qty = Number(item.quantity) || 0;
            const totalPrice = unitPrice * qty;
            return (
              <div className="cart-item" key={item.id}>
                <div className="cart-col" data-label="Item" style={{ flex: 3 }}>
                  <span className="item-name">{idx + 1}. {item.item}</span>
                  {itemObj?.tamil && <span className="item-tamil"> ({itemObj.tamil})</span>}
                </div>
                <div className="cart-col" data-label="Unit/Quantity" style={{ flex: 2, textAlign: 'center' }}>
                  {item.quantity} {item.unit}
                </div>
                <div className="cart-col" data-label="Price" style={{ flex: 1, textAlign: 'right' }}>
                  <span className="item-price">{totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : '-'}</span>
                </div>
              </div>
            );
          })}
        </div>

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

        <button type="button" onClick={handleSendWhatsApp} style={{ marginRight: '10px' }}>
          Send via WhatsApp
        </button>
        <button type="button" onClick={handleChangeOrder}>
          Change Order
        </button>
        <style>{`
          .cart-items-list {
            font-family: 'Segoe UI', 'Noto Sans Tamil', sans-serif;
            margin-bottom: 20px;
          }
          .cart-header, .cart-item {
            display: flex;
            padding: 12px 8px;
            border-bottom: 1px solid #eee;
            align-items: center;
            
          }
          .cart-header {
            background: #f7fafd;
            font-weight: 600;
            border-bottom: 2px solid #ddd;
          }
          .item-name { font-weight: 500; }
          .item-tamil { margin-left: 5px; color: #555; }
          .item-price { font-weight: 500; color: #0078d4; }

          @media (max-width: 600px) {
            .cart-header {
              display: none;
            }
            .cart-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
              margin-bottom: 12px;
              border-radius: 6px;
              border: 1px solid #e0e0e0;
              background: #f9f9f9;
              padding: 12px;
            }
            .cart-item > .cart-col {
              display: flex;
              width: 100%;
              text-align: left !important;
              flex-basis: auto;
              flex-grow: 1;
              gap: 10px;
            }
            .cart-item > .cart-col::before {
              content: attr(data-label);
              font-weight: bold;
              color: #0078d4;
              width: 100px;
              flex-shrink: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CartPage;
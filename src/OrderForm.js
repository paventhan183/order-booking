import React, { useState, useEffect } from 'react'; // <-- Add useEffect
import itemsData from './items.json';
import { useNavigate } from 'react-router-dom';

/* Add this style block */
const styles = `
/* Global form styles */
body, input, textarea, select, button {
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 16px;
  box-sizing: border-box;
}
input, textarea, select {
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 8px 10px;
  margin-top: 4px;
  margin-bottom: 4px;
  transition: border 0.2s;
  background: #fafbfc;
}
input:focus, textarea:focus, select:focus {
  border: 1.5px solid #0078d4;
  outline: none;
  background: #fff;
}
label {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}
button {
  background: #0078d4;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover, button:focus {
  background: #005fa3;
}
h2, h3 {
  color: #0078d4;
  margin-bottom: 10px;
}
.order-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  background: #f7fafd;
  border-radius: 6px;
}
/* Responsive table styles */
.responsive-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  display: block;
  overflow-x: auto;
}
.responsive-table thead {
  background: #f7fafd;
}
.responsive-table th, .responsive-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
  min-width: 100px;
}
@media (max-width: 700px) {
  .responsive-table, .responsive-table thead, .responsive-table tbody, .responsive-table th, .responsive-table td, .responsive-table tr {
    display: block;
    width: 100%;
  }
  .responsive-table thead {
    display: none;
  }
  .responsive-table tr {
    margin-bottom: 16px;
    background: #f7fafd;
    border-radius: 6px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    padding: 8px 0;
  }
  .responsive-table td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
    min-width: unset;
    text-align: left;
  }
  .responsive-table td:before {
    position: absolute;
    top: 8px;
    left: 12px;
    width: 45%;
    white-space: nowrap;
    font-weight: bold;
    color: #0078d4;
    content: attr(data-label);
  }
  .responsive-table td:last-child {
    border-bottom: none;
  }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('order-form-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'order-form-styles';
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
  });

  const [items, setItems] = useState([
    { id: Date.now(), item: '', unit: '', quantity: '' },
  ]);

  const navigate = useNavigate();

  // Populate from localStorage if available
  useEffect(() => {
    const storedFormData = localStorage.getItem('orderFormData');
    const storedItems = localStorage.getItem('orderFormItems');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems);
      // Ensure at least one item row exists
      setItems(parsedItems.length > 0 ? parsedItems : [{ id: Date.now(), item: '', unit: '', quantity: '' }]);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), item: '', unit: '', quantity: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const validateForm = () => {
    const phoneRegex = /^[0-9]{10}$/;
    return (
      formData.name.trim() !== '' &&
      phoneRegex.test(formData.mobile)
    );
  };

  const handleAddCart = () => {
    if (!validateForm()) {
      alert('Please fill all required fields correctly.');
      return;
    }

    // Store form data and items in localStorage
    localStorage.setItem('orderFormData', JSON.stringify(formData));
    localStorage.setItem('orderFormItems', JSON.stringify(items));

    // Redirect to cart page
    navigate('/cart');
  };

  const handleReset = () => {
    // Remove values from localStorage
    localStorage.removeItem('orderFormData');
    localStorage.removeItem('orderFormItems');
    // Reset form fields and items
    setFormData({
      name: '',
      address: '',
      mobile: '',
    });
    setItems([{ id: Date.now(), item: '', unit: '', quantity: '' }]);
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '40px auto',
      background: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: '32px 24px'
    }}>
      <h2>Order Form</h2>
      <div>
        <label>Name *</label><br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          autoComplete="off" // disable browser suggestion
        /><br /><br />

        <label>Address</label><br />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          autoComplete="off" // disable browser suggestion
        /><br /><br />

        <label>Mobile Number *</label><br />
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          maxLength="10"
          required
          autoComplete="off" // disable browser suggestion
        /><br /><br />

        <h3>Items</h3>
        {items.map((item, index) => {
          const selectedItem = itemsData.find((i) => i.name === item.item);
          const units = selectedItem ? selectedItem.units : [];
          const unitPrice =
            selectedItem && item.unit
              ? selectedItem.prices?.[item.unit] ?? 0
              : 0;
          const qty = Number(item.quantity) || 0;
          const totalPrice = unitPrice * qty;

          return (
            <div
              key={item.id}
              className="order-item-row"
              style={{
                background: '#f7fafd',
                borderRadius: 10,
                marginBottom: 18,
                border: '1px solid #e0e0e0',
                padding: '16px 12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10
              }}
            >
              {/* Item heading */}
              <div style={{ fontWeight: 600, color: '#0078d4', minWidth: 60, marginBottom: 4 }}>
                Item {index + 1}
              </div>
              {/* Item input */}
              <div style={{ flex: 2, minWidth: 120 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                    placeholder="Item Name"
                    autoComplete="off"
                    style={{ width: '100%' }}
                    onFocus={() => handleItemChange(item.id, 'showDropdown', true)}
                    onBlur={() => setTimeout(() => handleItemChange(item.id, 'showDropdown', false), 200)}
                  />
                  {item.showDropdown !== false && item.item && (
                    <div style={{
                      position: 'absolute',
                      background: '#fff',
                      border: '1px solid #ccc',
                      width: '100%',
                      maxHeight: '120px',
                      overflowY: 'auto',
                      zIndex: 10
                    }}>
                      {itemsData
                        .filter(i =>
                          i.name.toLowerCase().includes(item.item.toLowerCase()) ||
                          (i.tamilName && i.tamilName.toLowerCase().includes(item.item.toLowerCase()))
                        )
                        .map(i => (
                          <div
                            key={i.id}
                            style={{ padding: '5px', cursor: 'pointer' }}
                            onMouseDown={() => handleItemChange(item.id, 'item', i.name)}
                          >
                            {i.name}
                          </div>
                        ))}
                      {itemsData.filter(i => i.name.toLowerCase().includes(item.item.toLowerCase()) ||
                          (i.tamilName && i.tamilName.toLowerCase().includes(item.item.toLowerCase()))
                        ).length === 0 && (
                        <div style={{ padding: '5px', color: '#888' }}>No items found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Tamil column */}
              <div
                style={{
                  flex: 1,
                  minWidth: 100,
                  textAlign: 'center',
                  fontFamily: `'Noto Sans Tamil', 'Latha', 'Arial Unicode MS', Arial, sans-serif`,
                  fontSize: 18,
                  color: '#222',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {selectedItem && selectedItem.tamil ? selectedItem.tamil : ''}
              </div>
              {/* Unit select */}
              <div style={{ flex: 1, minWidth: 80 }}>
                <select
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(item.id, 'unit', e.target.value)
                  }
                  style={{ width: '100%' }}
                  autoComplete="off"
                >
                  <option value="">Select Unit</option>
                  {units.map((u, idx) => (
                    <option key={idx} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              {/* Quantity input */}
              <div style={{ flex: 1, minWidth: 80 }}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(item.id, 'quantity', e.target.value)
                  }
                  style={{ width: '100%' }}
                  autoComplete="off"
                  placeholder="Qty"
                />
              </div>
              {/* Price column */}
              <div style={{ flex: 1, minWidth: 80, textAlign: 'center', color: '#0078d4', fontWeight: 500 }}>
                {unitPrice && qty ? totalPrice.toFixed(2) : '-'}
              </div>
              {/* Remove button */}
              <div style={{ width: 80, textAlign: 'center' }}>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(item.id)} style={{ height: '40px', marginTop: '0' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <button type="button" onClick={addItem}>Add Item</button><br /><br />

        <button type="button" onClick={handleAddCart}>
          Add to Cart
        </button>
        <button type="button" onClick={handleReset} style={{ marginLeft: '10px', background: '#888' }}>
          Reset
        </button>

        {/* Responsive styles for mobile */}
        <style>
        {`
        @media (max-width: 700px) {
          .order-item-row {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 0 !important;
            padding: 12px 4px !important;
          }
          .order-item-row > div {
            flex: 1 1 48% !important;
            min-width: 0 !important;
            width: 48% !important;
            margin-bottom: 8px;
          }
          .order-item-row > div:first-child {
            flex-basis: 100% !important;
            min-width: 80px !important;
            margin-bottom: 4px;
          }
        }
        @media (max-width: 480px) {
          .order-item-row > div {
            flex-basis: 100% !important;
            min-width: 80px !important;
            width: 100% !important;
          }
        }
        `}
        </style>
      </div>
    </div>
  );
};

export default OrderForm;

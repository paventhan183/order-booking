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

/* New Order Form Item Styles */
.order-form-grid {
  font-family: 'Segoe UI', 'Noto Sans Tamil', sans-serif;
}
.order-form-grid h3 {
  padding-left: 8px;
  margin-top: 0;
}
.order-form-header, .order-item-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.order-form-header {
  font-weight: 600;
  padding: 8px;
  background: #f0f0f0;
  border-radius: 4px 4px 0 0;
  border-bottom: 2px solid #ddd;
}
.order-item-row {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}
.order-item-row:nth-child(even) {
    background: #f7fafd;
}
.order-item-col .tamil-name-display {
  font-family: 'Noto Sans Tamil', 'Latha', 'Arial Unicode MS', Arial, sans-serif;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 38px;
  display: flex;
  align-items: center;
}
.order-item-col .price-display {
  color: #0078d4;
  font-weight: 500;
}

@media (max-width: 800px) {
  .order-form-header {
    display: none;
  }
  .order-item-row {
    flex-direction: column;
    align-items: stretch;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f9f9f9;
  }
  .order-form-grid h3 {
    padding-left: 12px;
  }
  .order-item-col {
    display: flex;
    width: 100%;
    align-items: center;
    text-align: left !important;
  }
  .order-item-col::before {
    content: attr(data-label);
    font-weight: bold;
    color: #0078d4;
    width: 90px;
    flex-shrink: 0;
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
    const lastItem = items[items.length - 1];
    if (lastItem && lastItem.item.trim() === '') {
      alert('Please enter the item name for the current row before adding a new one.');
      return;
    }

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

    // Validate that all items have a name
    if (items.some(item => item.item.trim() === '')) {
      alert('Please make sure all items have a name before adding to cart.');
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
      maxWidth: '900px',
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

        <div className="order-form-grid">
          <h3>Items</h3>
          {/* Header for desktop */}
          <div className="order-form-header">
            <div style={{ flex: 3, minWidth: 150 }}>Item</div>
            <div style={{ flex: 2, minWidth: 100 }}>Tamil</div>
            <div style={{ flex: 1, minWidth: 90 }}>Unit</div>
            <div style={{ flex: 1, minWidth: 70 }}>Qty</div>
            <div style={{ flex: 1, minWidth: 80 }}>Price</div>
            <div style={{ width: 90, textAlign: 'center' }}>Action</div>
          </div>
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
            <div key={item.id} className="order-item-row">
              {/* Item input */}
              <div className="order-item-col item-name-col" data-label="Item" style={{ flex: 3, minWidth: 150 }}>
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
              <div className="order-item-col tamil-name-col" data-label="Tamil" style={{ flex: 2, minWidth: 100}}>
                <span className="tamil-name-display">{selectedItem?.tamil || ''}</span>
              </div>
              {/* Unit select */}
              <div className="order-item-col unit-col" data-label="Unit" style={{ flex: 1, minWidth: 90 }}>
                <select
                  value={item.unit}
                  onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
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
              <div className="order-item-col qty-col" data-label="Qty" style={{ flex: 1, minWidth: 70 }}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                  style={{ width: '100%' }}
                  autoComplete="off"
                  placeholder="Qty"
                />
              </div>
              {/* Price column */}
              <div className="order-item-col price-col" data-label="Price" style={{ flex: 1, minWidth: 80, justifyContent: 'flex-end' }}>
                <span className="price-display">{unitPrice && qty ? totalPrice.toFixed(2) : '-'}</span>
              </div>
              {/* Remove button */}
              <div className="order-item-col action-col" data-label="Action" style={{ width: 90, textAlign: 'center' }}>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(item.id)} style={{ height: '40px', marginTop: '0' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
        </div>

        <button type="button" onClick={addItem}>Add Item</button><br /><br />

        <button type="button" onClick={handleAddCart}>
          Add to Cart
        </button>
        <button type="button" onClick={handleReset} style={{ marginLeft: '10px', background: '#888' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default OrderForm;

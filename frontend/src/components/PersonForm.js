import React, { useState } from 'react';
import { familyTreeAPI } from '../services/api';

const PersonForm = ({ onPersonAdded }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    parent_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
      };
      await familyTreeAPI.createPerson(dataToSend);
      setFormData({
        first_name: '',
        last_name: '',
        birth_date: '',
        parent_id: ''
      });
      onPersonAdded();
    } catch (error) {
      console.error('Error creating person:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Добавить родственника</h3>
      <div>
        <input
          type="text"
          name="first_name"
          placeholder="Имя"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="text"
          name="last_name"
          placeholder="Фамилия"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="date"
          name="birth_date"
          placeholder="Дата рождения"
          value={formData.birth_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="number"
          name="parent_id"
          placeholder="ID родителя (опционально)"
          value={formData.parent_id}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Добавить</button>
    </form>
  );
};

export default PersonForm;
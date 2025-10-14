import React, { useState } from 'react';
import { familyTreeAPI } from '../services/api';
import './PersonForm.css';

const PersonForm = ({ onPersonAdded, persons }) => {
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
      alert('Родственник успешно добавлен!');
    } catch (error) {
      console.error('Error creating person:', error);
      alert('Ошибка при добавлении родственника');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="person-form">
      <h3>➕ Добавить родственника</h3>

      <div className="form-group">
        <label htmlFor="first_name">Имя *</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          placeholder="Введите имя"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="last_name">Фамилия *</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          placeholder="Введите фамилию"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="birth_date">Дата рождения</label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="parent_id">Родитель</label>
        <select
          id="parent_id"
          name="parent_id"
          value={formData.parent_id}
          onChange={handleChange}
        >
          <option value="">-- Выберите родителя --</option>
          {persons.map(person => (
            <option key={person.id} value={person.id}>
              {person.first_name} {person.last_name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-btn">
        Добавить в дерево
      </button>
    </form>
  );
};

export default PersonForm;
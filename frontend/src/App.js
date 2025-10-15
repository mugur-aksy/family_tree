import React, { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import FamilyTree from './components/FamilyTree';
import { familyTreeAPI } from './services/api';
import './App.css';

function App() {
  const [treeData, setTreeData] = useState([]);
  const [persons, setPersons] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const loadData = async () => {
    try {
      const [treeResponse, personsResponse] = await Promise.all([
        familyTreeAPI.getTree(),
        familyTreeAPI.getPersons()
      ]);
      setTreeData(treeResponse.data);
      setPersons(personsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  const handlePersonAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌳 Мое родовое дерево</h1>
      </header>
      <main className="App-main">
        <div className="form-section">
          <PersonForm
            onPersonAdded={handlePersonAdded}
            persons={persons}
          />
        </div>
        <div className="tree-section">
          <FamilyTree treeData={treeData} />
        </div>
      </main>
    </div>
  );
}

export default App;
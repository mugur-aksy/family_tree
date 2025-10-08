import React, { useState, useEffect } from 'react';
import PersonForm from './components/PersonForm';
import FamilyTree from './components/FamilyTree';
import { familyTreeAPI } from './services/api';

function App() {
  const [treeData, setTreeData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const loadTree = async () => {
    try {
      const response = await familyTreeAPI.getTree();
      setTreeData(response.data);
    } catch (error) {
      console.error('Error loading tree:', error);
    }
  };

  useEffect(() => {
    loadTree();
  }, [refresh]);

  const handlePersonAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <h1>Мое родовое дерево</h1>
      <PersonForm onPersonAdded={handlePersonAdded} />
      <FamilyTree treeData={treeData} />
    </div>
  );
}

export default App;
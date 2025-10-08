import React from 'react';

const TreeNode = ({ person }) => {
  return (
    <div style={{
      margin: '10px',
      padding: '10px',
      border: '1px solid #333',
      display: 'inline-block',
      textAlign: 'center'
    }}>
      <div><strong>{person.first_name} {person.last_name}</strong></div>
      {person.birth_date && <div>Род.: {person.birth_date}</div>}
      {person.children && person.children.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          {person.children.map(child => (
            <TreeNode key={child.id} person={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const FamilyTree = ({ treeData }) => {
  if (!treeData || treeData.length === 0) {
    return <div>Дерево пустое. Добавьте родственников!</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Родовое дерево</h2>
      {treeData.map(person => (
        <TreeNode key={person.id} person={person} />
      ))}
    </div>
  );
};

export default FamilyTree;
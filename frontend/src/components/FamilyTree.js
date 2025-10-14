import React from 'react';
import './FamilyTree.css';

const TreeNode = ({ person, level = 0 }) => {
  return (
    <div className={`tree-node level-${level}`}>
      <div className="person-card">
        <div className="person-name">
          {person.first_name} {person.last_name}
        </div>
        {person.birth_date && (
          <div className="person-birth">
            🎂 {new Date(person.birth_date).toLocaleDateString('ru-RU')}
          </div>
        )}
        <div className="person-id">ID: {person.id}</div>
      </div>

      {person.children && person.children.length > 0 && (
        <div className="children-container">
          {person.children.map(child => (
            <TreeNode key={child.id} person={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FamilyTree = ({ treeData }) => {
  if (!treeData || treeData.length === 0) {
    return (
      <div className="empty-tree">
        <h3>Дерево пока пустое 🌱</h3>
        <p>Добавьте первого родственника чтобы начать строить дерево!</p>
      </div>
    );
  }

  return (
    <div className="family-tree">
      <h2>🌳 Структура семьи</h2>
      <div className="tree-container">
        {treeData.map(person => (
          <TreeNode key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
};

export default FamilyTree;
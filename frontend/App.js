import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { familyTreeAPI } from './src/services/api';

const App = () => {
  const [treeData, setTreeData] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    parent_id: ''
  });

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
  }, []);

  const handleSubmit = async () => {
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
      loadTree();
    } catch (error) {
      console.error('Error creating person:', error);
    }
  };

  const TreeNode = ({ person, level = 0 }) => {
    return (
      <View style={[styles.node, { marginLeft: level * 20 }]}>
        <Text style={styles.nodeText}>
          {person.first_name} {person.last_name}
        </Text>
        {person.birth_date && (
          <Text style={styles.birthDate}>Род.: {person.birth_date}</Text>
        )}
        {person.children && person.children.map(child => (
          <TreeNode key={child.id} person={child} level={level + 1} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Мое родовое дерево</Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Добавить родственника</Text>
        <TextInput
          style={styles.input}
          placeholder="Имя"
          value={formData.first_name}
          onChangeText={(text) => setFormData({...formData, first_name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Фамилия"
          value={formData.last_name}
          onChangeText={(text) => setFormData({...formData, last_name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Дата рождения (YYYY-MM-DD)"
          value={formData.birth_date}
          onChangeText={(text) => setFormData({...formData, birth_date: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="ID родителя (опционально)"
          value={formData.parent_id}
          onChangeText={(text) => setFormData({...formData, parent_id: text})}
          keyboardType="numeric"
        />
        <Button title="Добавить" onPress={handleSubmit} />
      </View>

      <View style={styles.tree}>
        <Text style={styles.treeTitle}>Дерево:</Text>
        {treeData.map(person => (
          <TreeNode key={person.id} person={person} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  tree: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  treeTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  node: {
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
    marginBottom: 5,
  },
  nodeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  birthDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default App;
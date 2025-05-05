import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

// Mock data for tasks
const TASKS = [
  { id: '1', title: 'Complete Survey', reward: 50, description: 'Answer 10 questions about your shopping habits', timeRequired: '5 min' },
  { id: '2', title: 'Watch Video Ad', reward: 20, description: 'Watch a 30-second advertisement', timeRequired: '30 sec' },
  { id: '3', title: 'Refer a Friend', reward: 100, description: 'Invite a friend to join the app', timeRequired: '1 min' },
  { id: '4', title: 'Daily Check-in', reward: 10, description: 'Open the app daily to earn points', timeRequired: '10 sec' },
  { id: '5', title: 'Play Mini-Game', reward: 30, description: 'Play a simple puzzle game', timeRequired: '2 min' },
];

const TasksScreen = ({ navigation }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [balance, setBalance] = useState(0);

  const TaskItem = ({ item }) => {
    const isCompleted = completedTasks.includes(item.id);
    
    const completeTask = () => {
      if (!isCompleted) {
        setBalance(prevBalance => prevBalance + item.reward);
        setCompletedTasks(prev => [...prev, item.id]);
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.taskItem, isCompleted && styles.completedTask]} 
        onPress={() => navigation.navigate('TaskDetail', { task: item, onComplete: completeTask, isCompleted })}
      >
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          <Text style={styles.taskMeta}>Time: {item.timeRequired}</Text>
        </View>
        <View style={styles.taskReward}>
          <Text style={styles.rewardText}>₹{item.reward}</Text>
          {isCompleted && <Text style={{color: '#4CAF50', fontSize: 24}}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Available Tasks</Text>
      <FlatList
        data={TASKS}
        renderItem={({ item }) => <TaskItem item={item} />}
        keyExtractor={item => item.id}
        style={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#5D4037',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedTask: {
    opacity: 0.7,
    backgroundColor: '#F5F5DC',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#5D4037',
  },
  taskDescription: {
    fontSize: 14,
    color: '#795548',
    marginBottom: 8,
  },
  taskMeta: {
    fontSize: 12,
    color: '#A1887F',
  },
  taskReward: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
});

export default TasksScreen;
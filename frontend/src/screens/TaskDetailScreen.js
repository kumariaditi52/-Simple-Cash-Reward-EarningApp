import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TaskDetailScreen = ({ route, navigation }) => {
  const { task, onComplete, isCompleted } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.taskDetailCard}>
        <Text style={styles.taskDetailTitle}>{task.title}</Text>
        <Text style={styles.taskDetailDescription}>{task.description}</Text>
        <View style={styles.taskDetailMeta}>
          <Text style={styles.taskDetailMetaText}>Reward: ₹{task.reward}</Text>
          <Text style={styles.taskDetailMetaText}>Time: {task.timeRequired}</Text>
        </View>
        
        {!isCompleted ? (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={() => {
              onComplete();
              navigation.goBack();
            }}
          >
            <Text style={styles.completeButtonText}>Complete Task</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedButton}>
            <Text style={styles.completedButtonText}>Task Completed</Text>
            <Text style={{color: 'white', fontSize: 24}}>✓</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
  },
  taskDetailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#5D4037',
  },
  taskDetailDescription: {
    fontSize: 16,
    color: '#795548',
    marginBottom: 20,
    lineHeight: 24,
  },
  taskDetailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  taskDetailMetaText: {
    fontSize: 14,
    color: '#A1887F',
  },
  completeButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
});

export default TaskDetailScreen;
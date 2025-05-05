import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

// Mock data for tasks
const TASKS = [
  { id: '1', title: 'Complete Survey', reward: 50, description: 'Answer 10 questions about your shopping habits', timeRequired: '5 min' },
  { id: '2', title: 'Watch Video Ad', reward: 20, description: 'Watch a 30-second advertisement', timeRequired: '30 sec' },
  { id: '3', title: 'Refer a Friend', reward: 100, description: 'Invite a friend to join the app', timeRequired: '1 min' },
  { id: '4', title: 'Daily Check-in', reward: 10, description: 'Open the app daily to earn points', timeRequired: '10 sec' },
  { id: '5', title: 'Play Mini-Game', reward: 30, description: 'Play a simple puzzle game', timeRequired: '2 min' },
];

// Home Screen
const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);

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
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance}</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

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

// Task Detail Screen
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

// Profile Screen
const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImagePlaceholder}>
          <Text style={styles.profileImageText}>User</Text>
        </View>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>john.doe@example.com</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹450</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>
      </View>
      
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={{fontSize: 24, color: '#8B4513'}}>👤</Text>
          <Text style={styles.settingsText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={{fontSize: 24, color: '#8B4513'}}>💳</Text>
          <Text style={styles.settingsText}>Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={{fontSize: 24, color: '#8B4513'}}>⚙️</Text>
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={{fontSize: 24, color: '#8B4513'}}>🚪</Text>
          <Text style={styles.settingsText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Tasks" 
        component={HomeScreen} 
        options={{ 
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFF8E1', // Light cream color
          },
          headerTintColor: '#8B4513', // Brown color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen} 
        options={{ 
          title: 'Task Details',
          headerStyle: {
            backgroundColor: '#FFF8E1', // Light cream color
          },
          headerTintColor: '#8B4513', // Brown color
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
    </Stack.Navigator>
  );
};

// Main App Component
const App = () => {
  // Define custom colors for the app
  const colors = {
    primary: '#8B4513',     // Brown color
    secondary: '#A0522D',   // Sienna (darker brown)
    accent: '#D2691E',      // Chocolate (lighter brown)
    success: '#4CAF50',     // Green for success states
    info: '#D2B48C',        // Tan (light brown)
    warning: '#FFA500',     // Orange for warnings
    danger: '#FF6347',      // Tomato for errors
    light: '#FFF8E1',       // Very light cream for backgrounds
    dark: '#5D4037',        // Dark brown for text
    white: '#FFFFFF',       // White
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'Home') {
              // Home icon using Unicode symbol
              return (
                <View style={{
                  backgroundColor: focused ? colors.primary : 'transparent',
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 20,
                    color: focused ? colors.white : colors.primary,
                    fontWeight: 'bold',
                  }}>⌂</Text>
                </View>
              );
            } else if (route.name === 'Profile') {
              // Profile icon using Unicode symbol
              return (
                <View style={{
                  backgroundColor: focused ? colors.primary : 'transparent',
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 20,
                    color: focused ? colors.white : colors.primary,
                    fontWeight: 'bold',
                  }}>⍟</Text>
                </View>
              );
            }
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: {
            backgroundColor: colors.light,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            height: 60,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ 
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            headerStyle: {
              backgroundColor: colors.light,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // Light cream background color
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#8B4513', // Brown color
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  withdrawText: {
    color: '#8B4513', // Brown color
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#5D4037', // Dark brown text color
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
    backgroundColor: '#F5F5DC', // Beige color for completed tasks
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#5D4037', // Dark brown text color
  },
  taskDescription: {
    fontSize: 14,
    color: '#795548', // Medium brown text color
    marginBottom: 8,
  },
  taskMeta: {
    fontSize: 12,
    color: '#A1887F', // Light brown text color
  },
  taskReward: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513', // Brown color
    marginBottom: 4,
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
    color: '#5D4037', // Dark brown text color
  },
  taskDetailDescription: {
    fontSize: 16,
    color: '#795548', // Medium brown text color
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
    color: '#A1887F', // Light brown text color
  },
  completeButton: {
    backgroundColor: '#8B4513', // Brown color
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
    backgroundColor: '#4CAF50', // Success green color
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
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8B4513', // Brown color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#5D4037', // Dark brown text color
  },
  profileEmail: {
    fontSize: 16,
    color: '#795548', // Medium brown text color
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513', // Brown color
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#795548', // Medium brown text color
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5DC', // Beige color for borders
  },
  settingsText: {
    fontSize: 16,
    color: '#5D4037', // Dark brown text color
    marginLeft: 16,
  },
});

export default App;
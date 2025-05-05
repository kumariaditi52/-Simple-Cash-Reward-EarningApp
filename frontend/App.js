import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, Modal, Alert } from 'react-native';

// Mock data for tasks
const TASKS = [
  { id: '1', title: 'Complete Survey', reward: 50, description: 'Answer 10 questions about your shopping habits', timeRequired: '5 min' },
  { id: '2', title: 'Watch Video Ad', reward: 20, description: 'Watch a 30-second advertisement', timeRequired: '30 sec' },
  { id: '3', title: 'Refer a Friend', reward: 100, description: 'Invite a friend to join the app', timeRequired: '1 min' },
  { id: '4', title: 'Daily Check-in', reward: 10, description: 'Open the app daily to earn points', timeRequired: '10 sec' },
  { id: '5', title: 'Play Mini-Game', reward: 30, description: 'Play a simple puzzle game', timeRequired: '2 min' },
];

// Mock data for games
const GAMES = [
  { id: '1', title: 'Ludo', reward: 50, image: '🎲', description: 'Play Ludo and earn rewards', minPlayTime: 120, rewardPerMinute: 5, maxScore: 100 },
  { id: '2', title: 'Snake', reward: 40, image: '🐍', description: 'Classic Snake game', minPlayTime: 60, rewardPerMinute: 8, maxScore: 50 },
  { id: '3', title: 'Puzzle', reward: 30, image: '🧩', description: 'Solve puzzles to earn', minPlayTime: 180, rewardPerMinute: 4, maxScore: 200 },
  { id: '4', title: 'Tic Tac Toe', reward: 25, image: '⭕', description: 'Play Tic Tac Toe', minPlayTime: 90, rewardPerMinute: 6, maxScore: 30 },
  { id: '5', title: 'Memory Match', reward: 35, image: '🃏', description: 'Match cards to win', minPlayTime: 150, rewardPerMinute: 5, maxScore: 80 },
  { id: '6', title: 'Word Search', reward: 45, image: '📝', description: 'Find hidden words', minPlayTime: 200, rewardPerMinute: 4, maxScore: 150 },
  { id: '7', title: 'Sudoku', reward: 60, image: '🔢', description: 'Solve Sudoku puzzles', minPlayTime: 300, rewardPerMinute: 3, maxScore: 100 },
  { id: '8', title: 'Racing', reward: 40, image: '🏎️', description: 'Race to win rewards', minPlayTime: 120, rewardPerMinute: 7, maxScore: 200 },
  { id: '9', title: 'Tetris', reward: 55, image: '🧱', description: 'Classic Tetris game', minPlayTime: 180, rewardPerMinute: 5, maxScore: 500 },
  { id: '10', title: 'Quiz', reward: 50, image: '❓', description: 'Answer quiz questions', minPlayTime: 240, rewardPerMinute: 4, maxScore: 100 },
];

// Context for global state management
const AppContext = React.createContext();

// Home Screen
const HomeScreen = ({ navigation }) => {
  const { balance, setBalance, gameHistory } = React.useContext(AppContext);

  const GameItem = ({ item }) => {
    // Check if game was played recently
    const wasPlayedRecently = gameHistory.some(
      game => game.id === item.id && 
      (new Date().getTime() - game.endTime) < 24 * 60 * 60 * 1000 // 24 hours
    );

    return (
      <TouchableOpacity 
        style={[styles.gameItem, wasPlayedRecently && styles.recentlyPlayedGame]}
        onPress={() => navigation.navigate('GameDetail', { game: item })}
      >
        <Text style={styles.gameEmoji}>{item.image}</Text>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameReward}>₹{item.reward}</Text>
        {wasPlayedRecently && (
          <View style={styles.playedBadge}>
            <Text style={styles.playedBadgeText}>Played</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance}</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Popular Games</Text>
      <View style={styles.gamesContainer}>
        {GAMES.map(game => (
          <GameItem key={game.id} item={game} />
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.tasksButton}
        onPress={() => navigation.navigate('Tasks')}
      >
        <Text style={styles.tasksButtonIcon}>📚</Text>
        <Text style={styles.tasksButtonText}>View All Tasks</Text>
      </TouchableOpacity>

      {gameHistory.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Game Activity</Text>
          <View style={styles.historyContainer}>
            {gameHistory.slice(0, 3).map((game, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <Text style={styles.historyItemEmoji}>{GAMES.find(g => g.id === game.id)?.image || '🎮'}</Text>
                  <View>
                    <Text style={styles.historyItemTitle}>{GAMES.find(g => g.id === game.id)?.title || 'Game'}</Text>
                    <Text style={styles.historyItemTime}>
                      {new Date(game.endTime).toLocaleDateString()} • {Math.floor(game.playTime / 60)}m {game.playTime % 60}s
                    </Text>
                  </View>
                </View>
                <View style={styles.historyItemRight}>
                  <Text style={styles.historyItemScore}>Score: {game.score}</Text>
                  <Text style={styles.historyItemReward}>+₹{game.earnedReward}</Text>
                </View>
              </View>
            ))}
            {gameHistory.length > 3 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('GameHistory')}
              >
                <Text style={styles.viewAllButtonText}>View All Activity</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

// Tasks Screen
const TasksScreen = ({ navigation }) => {
  const { balance, setBalance, completedTasks, setCompletedTasks } = React.useContext(AppContext);

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

// Game Detail Screen
const GameDetailScreen = ({ route, navigation }) => {
  const { game } = route.params;
  const { balance, setBalance, gameHistory, setGameHistory } = React.useContext(AppContext);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  // Simulated game score incrementer
  const incrementScore = () => {
    if (isPlaying) {
      setGameScore(prev => {
        const increment = Math.floor(Math.random() * 5) + 1;
        return Math.min(prev + increment, game.maxScore);
      });
    }
  };

  // Start the game
  const startGame = () => {
    setIsPlaying(true);
    setStartTime(new Date().getTime());
    setPlayTime(0);
    setGameScore(0);
    
    // Start timer to track play time
    timerRef.current = setInterval(() => {
      setPlayTime(prev => prev + 1);
      
      // Randomly increment score every few seconds
      if (Math.random() > 0.7) {
        incrementScore();
      }
    }, 1000);
  };

  // End the game
  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsPlaying(false);
    
    const endTime = new Date().getTime();
    const totalPlayTimeSeconds = playTime;
    
    // Calculate reward based on play time and score
    let earnedReward = 0;
    
    // Only reward if minimum play time is met
    if (totalPlayTimeSeconds >= game.minPlayTime) {
      // Base reward from game
      earnedReward = game.reward;
      
      // Additional reward based on play time (capped at 2x base reward)
      const timeBonus = Math.min(
        Math.floor(totalPlayTimeSeconds / 60) * game.rewardPerMinute,
        game.reward
      );
      
      // Score bonus (up to 50% of base reward)
      const scorePercentage = gameScore / game.maxScore;
      const scoreBonus = Math.floor(game.reward * 0.5 * scorePercentage);
      
      earnedReward += timeBonus + scoreBonus;
      
      // Add to balance
      setBalance(prev => prev + earnedReward);
      
      // Add to game history
      const gameRecord = {
        id: game.id,
        playTime: totalPlayTimeSeconds,
        score: gameScore,
        startTime: startTime,
        endTime: endTime,
        earnedReward: earnedReward
      };
      
      setGameHistory(prev => [gameRecord, ...prev]);
      
      // Show completion alert
      Alert.alert(
        "Game Completed!",
        `You played for ${Math.floor(totalPlayTimeSeconds / 60)}m ${totalPlayTimeSeconds % 60}s and scored ${gameScore} points.\n\nYou earned ₹${earnedReward}!`,
        [{ text: "Great!", onPress: () => navigation.goBack() }]
      );
    } else {
      // Not enough play time
      Alert.alert(
        "Play Time Too Short",
        `You need to play for at least ${Math.floor(game.minPlayTime / 60)} minutes to earn rewards.`,
        [{ text: "OK" }]
      );
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {isPlaying ? (
        <View style={styles.gamePlayContainer}>
          <View style={styles.gamePlayHeader}>
            <View style={styles.gamePlayStat}>
              <Text style={styles.gamePlayStatLabel}>Time</Text>
              <Text style={styles.gamePlayStatValue}>{formatTime(playTime)}</Text>
            </View>
            <View style={styles.gamePlayStat}>
              <Text style={styles.gamePlayStatLabel}>Score</Text>
              <Text style={styles.gamePlayStatValue}>{gameScore}</Text>
            </View>
          </View>
          
          <View style={styles.gamePlayArea}>
            <Text style={styles.gamePlayEmoji}>{game.image}</Text>
            <Text style={styles.gamePlayText}>Playing {game.title}...</Text>
            <Text style={styles.gamePlaySubtext}>
              Tap anywhere to simulate gameplay.{'\n'}
              Play for at least {Math.floor(game.minPlayTime / 60)} minutes to earn rewards.
            </Text>
            
            <TouchableOpacity 
              style={styles.gamePlayTapArea}
              onPress={incrementScore}
            >
              <Text style={styles.gamePlayTapText}>Tap to Play</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.endGameButton}
            onPress={endGame}
          >
            <Text style={styles.endGameButtonText}>End Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameDetailCard}>
          <Text style={styles.gameDetailTitle}>{game.title}</Text>
          <Text style={styles.gameDetailDescription}>{game.description}</Text>
          
          <View style={styles.gameDetailMeta}>
            <Text style={styles.gameDetailMetaText}>Base Reward: ₹{game.reward}</Text>
          </View>
          
          <View style={styles.gameRules}>
            <Text style={styles.gameRulesTitle}>How to Earn:</Text>
            <Text style={styles.gameRulesText}>• Play for at least {Math.floor(game.minPlayTime / 60)} minutes</Text>
            <Text style={styles.gameRulesText}>• Earn ₹{game.rewardPerMinute} extra per minute played</Text>
            <Text style={styles.gameRulesText}>• Bonus rewards for high scores</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={startGame}
          >
            <Text style={styles.playButtonText}>Play Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Game History Screen
const GameHistoryScreen = () => {
  const { gameHistory } = React.useContext(AppContext);
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Game History</Text>
      
      {gameHistory.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateEmoji}>🎮</Text>
          <Text style={styles.emptyStateText}>You haven't played any games yet</Text>
          <Text style={styles.emptyStateSubtext}>Play games to earn rewards and track your progress</Text>
        </View>
      ) : (
        <FlatList
          data={gameHistory}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => {
            const gameDetails = GAMES.find(g => g.id === item.id) || {};
            return (
              <View style={styles.historyDetailItem}>
                <View style={styles.historyDetailHeader}>
                  <View style={styles.historyDetailLeft}>
                    <Text style={styles.historyDetailEmoji}>{gameDetails.image || '🎮'}</Text>
                    <Text style={styles.historyDetailTitle}>{gameDetails.title || 'Game'}</Text>
                  </View>
                  <Text style={styles.historyDetailReward}>+₹{item.earnedReward}</Text>
                </View>
                
                <View style={styles.historyDetailStats}>
                  <View style={styles.historyDetailStat}>
                    <Text style={styles.historyDetailStatLabel}>Date</Text>
                    <Text style={styles.historyDetailStatValue}>
                      {new Date(item.endTime).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.historyDetailStat}>
                    <Text style={styles.historyDetailStatLabel}>Time Played</Text>
                    <Text style={styles.historyDetailStatValue}>
                      {Math.floor(item.playTime / 60)}m {item.playTime % 60}s
                    </Text>
                  </View>
                  <View style={styles.historyDetailStat}>
                    <Text style={styles.historyDetailStatLabel}>Score</Text>
                    <Text style={styles.historyDetailStatValue}>{item.score}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
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
  const { balance, gameHistory, completedTasks } = React.useContext(AppContext);
  
  // Calculate total earnings
  const totalEarned = balance + 
    gameHistory.reduce((sum, game) => sum + game.earnedReward, 0) +
    completedTasks.reduce((sum, taskId) => {
      const task = TASKS.find(t => t.id === taskId);
      return sum + (task ? task.reward : 0);
    }, 0);
  
  // Calculate total games played
  const gamesPlayed = gameHistory.length;
  
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
          <Text style={styles.statValue}>₹{totalEarned}</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedTasks.length + gamesPlayed}</Text>
          <Text style={styles.statLabel}>Activities Completed</Text>
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
          <Text style={{fontSize: 24, color: '#8B4513'}}>📊</Text>
          <Text style={styles.settingsText}>Game Statistics</Text>
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
        name="Home" 
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
        name="Tasks" 
        component={TasksScreen} 
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
      <Stack.Screen 
        name="GameDetail" 
        component={GameDetailScreen} 
        options={{ 
          title: 'Game Details',
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
        name="GameHistory" 
        component={GameHistoryScreen} 
        options={{ 
          title: 'Game History',
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
  // App state
  const [balance, setBalance] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);

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
    <AppContext.Provider value={{
      balance,
      setBalance,
      completedTasks,
      setCompletedTasks,
      gameHistory,
      setGameHistory
    }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === 'HomeTab') {
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
            name="HomeTab" 
            component={HomeStack} 
            options={{ 
              headerShown: false,
              title: 'Home'
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
    </AppContext.Provider>
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
  // Game related styles
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gameItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  recentlyPlayedGame: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  playedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  playedBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gameEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 4,
    textAlign: 'center',
  },
  gameReward: {
    fontSize: 14,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  gameDetailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameDetailEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  gameDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#5D4037',
  },
  gameDetailDescription: {
    fontSize: 16,
    color: '#795548',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameDetailMeta: {
    marginBottom: 16,
  },
  gameDetailMetaText: {
    fontSize: 16,
    color: '#A1887F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameRules: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  gameRulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
  },
  gameRulesText: {
    fontSize: 14,
    color: '#795548',
    marginBottom: 4,
  },
  playButton: {
    backgroundColor: '#8B4513',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  playButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tasksButton: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tasksButtonIcon: {
    fontSize: 24,
    marginRight: 8,
    color: 'white',
  },
  tasksButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Game play styles
  gamePlayContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
  },
  gamePlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5DC',
  },
  gamePlayStat: {
    alignItems: 'center',
  },
  gamePlayStatLabel: {
    fontSize: 14,
    color: '#795548',
    marginBottom: 4,
  },
  gamePlayStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  gamePlayArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  gamePlayEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  gamePlayText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
  },
  gamePlaySubtext: {
    fontSize: 14,
    color: '#795548',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  gamePlayTapArea: {
    backgroundColor: '#FFF3E0',
    width: '100%',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderStyle: 'dashed',
  },
  gamePlayTapText: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  endGameButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  endGameButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Game history styles
  historyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5DC',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#A1887F',
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyItemScore: {
    fontSize: 14,
    color: '#5D4037',
  },
  historyItemReward: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllButtonText: {
    color: '#8B4513',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyDetailItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5DC',
  },
  historyDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDetailEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  historyDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  historyDetailReward: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  historyDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyDetailStat: {
    alignItems: 'center',
  },
  historyDetailStatLabel: {
    fontSize: 12,
    color: '#A1887F',
    marginBottom: 4,
  },
  historyDetailStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#795548',
    textAlign: 'center',
  },
});

export default App;
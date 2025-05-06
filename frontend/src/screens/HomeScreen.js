import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Mock data for games
const GAMES = [
  { id: '1', title: 'Ludo', reward: 50, image: '🎲', description: 'Play Ludo and earn rewards' },
  { id: '2', title: 'Snake', reward: 40, image: '🐍', description: 'Classic Snake game' },
  { id: '3', title: 'Puzzle', reward: 30, image: '🧩', description: 'Solve puzzles to earn' },
  { id: '4', title: 'Tic Tac Toe', reward: 25, image: '⭕', description: 'Play Tic Tac Toe' },
  { id: '5', title: 'Memory Match', reward: 35, image: '🃏', description: 'Match cards to win' },
  { id: '6', title: 'Word Search', reward: 45, image: '📝', description: 'Find hidden words' },
  { id: '7', title: 'Sudoku', reward: 60, image: '🔢', description: 'Solve Sudoku puzzles' },
  { id: '8', title: 'Racing', reward: 40, image: '🏎️', description: 'Race to win rewards' },
  { id: '9', title: 'Tetris', reward: 55, image: '🧱', description: 'Classic Tetris game' },
  { id: '10', title: 'Quiz', reward: 50, image: '❓', description: 'Answer quiz questions' },
];

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);

  const navigateToGame = (game) => {
    // For Ludo, navigate directly to the Ludo game screen
    if (game.id === 'ludo1' || game.title === 'Ludo') {
      navigation.navigate('LudoGame', { game });
    } 
    // For Snake, navigate directly to the Snake game screen
    else if (game.id === 'snake1' || game.title === 'Snake') {
      navigation.navigate('SnakeGame', { game });
    }
    else {
      navigation.navigate('GameDetail', { game });
    }
  };

  const GameItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.gameItem}
        onPress={() => navigateToGame(item)}
      >
        <Text style={styles.gameEmoji}>{item.image}</Text>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameReward}>₹{item.reward}</Text>
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
    </ScrollView>
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
});

export default HomeScreen;
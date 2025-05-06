import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GameDetailScreen = ({ route, navigation }) => {
  const { game } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.gameDetailCard}>
        <Text style={styles.gameDetailEmoji}>{game.image}</Text>
        <Text style={styles.gameDetailTitle}>{game.title}</Text>
        <Text style={styles.gameDetailDescription}>{game.description}</Text>
        <View style={styles.gameDetailMeta}>
          <Text style={styles.gameDetailMetaText}>Reward: ₹{game.reward}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => navigation.navigate('GamePlay', { game })}
        >
          <Text style={styles.playButtonText}>Play Now</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameRules}>
        <Text style={styles.gameRulesTitle}>How to Play:</Text>
        <Text style={styles.gameRulesText}>• Complete the game objectives</Text>
        <Text style={styles.gameRulesText}>• Earn points based on your performance</Text>
        <Text style={styles.gameRulesText}>• Play for at least {Math.floor((game.minPlayTime || 60) / 60)} minutes to earn rewards</Text>
        <Text style={styles.gameRulesText}>• Higher scores earn bigger rewards!</Text>
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
});

export default GameDetailScreen;
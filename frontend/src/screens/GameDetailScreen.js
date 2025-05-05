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
        
        <Touch
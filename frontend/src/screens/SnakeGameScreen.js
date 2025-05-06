import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { AppContext } from '../../App';

const GRID_SIZE = 15;
const CELL_SIZE = Math.floor(Dimensions.get('window').width * 0.9 / GRID_SIZE);

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  RIGHT: { x: 1, y: 0 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 }
};

const SnakeGameScreen = ({ route, navigation }) => {
  const { game } = route.params;
  const { setBalance, setGameHistory } = React.useContext(AppContext);
  
  // Game state
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  
  // Refs for game loop
  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);
  
  const startGame = () => {
    // Reset game state
    setSnake([{ x: 5, y: 5 }]);
    generateFood();
    setDirection(DIRECTIONS.RIGHT);
    setGameOver(false);
    setScore(0);
    setPlayTime(0);
    setStartTime(new Date().getTime());
    setIsPlaying(true);
    
    // Start game loop
    gameLoopRef.current = setInterval(moveSnake, 200);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setPlayTime(prev => prev + 1);
    }, 1000);
  };
  
  // End the game
  const endGame = (gameOverState = false) => {
    // Clear intervals
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsPlaying(false);
    
    if (gameOverState) {
      setGameOver(true);
      return;
    }
    
    const endTime = new Date().getTime();
    const totalPlayTimeSeconds = playTime;
    
    // Calculate reward based on play time and score
    let earnedReward = 0;
    
    // Only reward if minimum play time is met
    if (totalPlayTimeSeconds >= (game.minPlayTime || 60)) {
      // Base reward from game
      earnedReward = game.reward || 35;
      
      // Additional reward based on play time (capped at 2x base reward)
      const timeBonus = Math.min(
        Math.floor(totalPlayTimeSeconds / 60) * (game.rewardPerMinute || 4),
        game.reward || 35
      );
      
      // Score bonus (up to 50% of base reward)
      const scorePercentage = Math.min(score / (game.maxScore || 80), 1);
      const scoreBonus = Math.floor((game.reward || 35) * 0.5 * scorePercentage);
      
      earnedReward += timeBonus + scoreBonus;
      
      // Add to balance
      setBalance(prev => prev + earnedReward);
      
      // Add to game history
      const gameRecord = {
        id: game.id,
        playTime: totalPlayTimeSeconds,
        score: score,
        startTime: startTime,
        endTime: endTime,
        earnedReward: earnedReward
      };
      
      setGameHistory(prev => [gameRecord, ...prev]);
      
      // Show completion alert
      Alert.alert(
        "Game Completed!",
        `You played for ${Math.floor(totalPlayTimeSeconds / 60)}m ${totalPlayTimeSeconds % 60}s and scored ${score} points.\n\nYou earned ₹${earnedReward}!`,
        [{ text: "Great!", onPress: () => navigation.goBack() }]
      );
    } else {
      // Not enough play time
      Alert.alert(
        "Play Time Too Short",
        `You need to play for at least ${Math.floor((game.minPlayTime || 60) / 60)} minutes to earn rewards.`,
        [{ text: "OK" }]
      );
    }
  };
  
  // Generate food at random position
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Make sure food doesn't appear on snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) {
      generateFood();
    } else {
      setFood(newFood);
    }
  };
  
  // Move the snake
  const moveSnake = () => {
    if (gameOver) return;
    
    const head = snake[0];
    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y
    };
    
    // Check for collisions with walls
    if (
      newHead.x < 0 || 
      newHead.x >= GRID_SIZE || 
      newHead.y < 0 || 
      newHead.y >= GRID_SIZE
    ) {
      endGame(true);
      return;
    }
    
    // Check for collisions with self
    const selfCollision = snake.some(segment => 
      segment.x === newHead.x && segment.y === newHead.y
    );
    
    if (selfCollision) {
      endGame(true);
      return;
    }
    
    // Check if snake eats food
    const eatsFood = newHead.x === food.x && newHead.y === food.y;
    
    // Create new snake
    const newSnake = [newHead, ...snake];
    
    if (eatsFood) {
      // Snake grows, generate new food, increase score
      generateFood();
      setScore(prev => prev + 10);
    } else {
      // Remove tail
      newSnake.pop();
    }
    
    setSnake(newSnake);
  };
  
  // Change direction
  const changeDirection = (newDirection) => {
    // Prevent 180-degree turns
    if (
      (direction === DIRECTIONS.UP && newDirection === DIRECTIONS.DOWN) ||
      (direction === DIRECTIONS.DOWN && newDirection === DIRECTIONS.UP) ||
      (direction === DIRECTIONS.LEFT && newDirection === DIRECTIONS.RIGHT) ||
      (direction === DIRECTIONS.RIGHT && newDirection === DIRECTIONS.LEFT)
    ) {
      return;
    }
    
    setDirection(newDirection);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render game board
  const renderBoard = () => {
    // Create grid cells
    const cells = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // Check if cell contains snake
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        
        // Check if cell contains food
        const isFood = food.x === x && food.y === y;
        
        // Check if cell is snake head
        const isHead = snake[0].x === x && snake[0].y === y;
        
        // Determine cell style
        let cellStyle = [styles.cell];
        if (isSnake) cellStyle.push(styles.snakeCell);
        if (isHead) cellStyle.push(styles.snakeHead);
        if (isFood) cellStyle.push(styles.foodCell);
        
        cells.push(
          <View 
            key={`${x}-${y}`} 
            style={[
              ...cellStyle,
              {
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE
              }
            ]} 
          />
        );
      }
    }
    
    return cells;
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
              <Text style={styles.gamePlayStatValue}>{score}</Text>
            </View>
          </View>
          
          <View 
            style={[
              styles.gameBoard,
              {
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE
              }
            ]}
          >
            {renderBoard()}
          </View>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.upButton]} 
              onPress={() => changeDirection(DIRECTIONS.UP)}
            >
              <Text style={styles.controlButtonText}>↑</Text>
            </TouchableOpacity>
            
            <View style={styles.middleControls}>
              <TouchableOpacity 
                style={[styles.controlButton, styles.leftButton]} 
                onPress={() => changeDirection(DIRECTIONS.LEFT)}
              >
                <Text style={styles.controlButtonText}>←</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, styles.rightButton]} 
                onPress={() => changeDirection(DIRECTIONS.RIGHT)}
              >
                <Text style={styles.controlButtonText}>→</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.downButton]} 
              onPress={() => changeDirection(DIRECTIONS.DOWN)}
            >
              <Text style={styles.controlButtonText}>↓</Text>
            </TouchableOpacity>
          </View>
          
          {gameOver && (
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Text style={styles.gameOverScore}>Score: {score}</Text>
              <TouchableOpacity 
                style={styles.restartButton}
                onPress={startGame}
              >
                <Text style={styles.restartButtonText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.endGameButton}
            onPress={() => endGame()}
          >
            <Text style={styles.endGameButtonText}>End Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameDetailCard}>
          <Text style={styles.gameDetailTitle}>Snake Game</Text>
          <Text style={styles.gameDetailDescription}>
            Control the snake to eat food and grow longer. Avoid hitting walls or yourself!
          </Text>
          
          <View style={styles.gameDetailMeta}>
            <Text style={styles.gameDetailMetaText}>Base Reward: ₹{game.reward || 35}</Text>
          </View>
          
          <View style={styles.gameRules}>
            <Text style={styles.gameRulesTitle}>How to Play:</Text>
            <Text style={styles.gameRulesText}>• Use arrow buttons to change direction</Text>
            <Text style={styles.gameRulesText}>• Eat food to grow and earn points</Text>
            <Text style={styles.gameRulesText}>• Avoid hitting walls or yourself</Text>
            <Text style={styles.gameRulesText}>• Play for at least {Math.floor((game.minPlayTime || 60) / 60)} minutes to earn rewards</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
  },
  gamePlayContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  gamePlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5DC',
  },
  gamePlayStat: {
    alignItems: 'center',
    flex: 1,
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
  gameBoard: {
    backgroundColor: '#EFEFEF',
    borderWidth: 2,
    borderColor: '#8B4513',
    position: 'relative',
    marginBottom: 20,
  },
  cell: {
    position: 'absolute',
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  snakeCell: {
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  snakeHead: {
    backgroundColor: '#388E3C',
    borderRadius: 4,
  },
  foodCell: {
    backgroundColor: '#F44336',
    borderRadius: CELL_SIZE / 2,
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  middleControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 160,
    marginVertical: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF3E0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  upButton: {
    marginBottom: 10,
  },
  downButton: {
    marginTop: 10,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  gameOverScore: {
    fontSize: 24,
    color: 'white',
    marginBottom: 24,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endGameButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  endGameButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
    lineHeight: 22,
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
});

export default SnakeGameScreen;

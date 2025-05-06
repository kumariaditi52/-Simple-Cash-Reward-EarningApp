// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { AppContext } from '../../App';

// const LudoGameScreen = ({ route, navigation }) => {
//   const { game } = route.params;
//   const { balance, setBalance, gameHistory, setGameHistory } = useContext(AppContext);
  
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playTime, setPlayTime] = useState(0);
//   const [gameScore, setGameScore] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [diceValue, setDiceValue] = useState(1);
//   const [currentPlayer, setCurrentPlayer] = useState('red');
//   const timerRef = React.useRef(null);
  
//   // Start the game
//   const startGame = () => {
//     setIsPlaying(true);
//     setStartTime(new Date().getTime());
//     setPlayTime(0);
//     setGameScore(0);
//     setDiceValue(1);
//     setCurrentPlayer('red');
    
//     // Start timer to track play time
//     timerRef.current = setInterval(() => {
//       setPlayTime(prev => prev + 1);
//     }, 1000);
//   };
  
//   // Roll the dice
//   const rollDice = () => {
//     const newValue = Math.floor(Math.random() * 6) + 1;
//     setDiceValue(newValue);
    
//     // Increment score
//     setGameScore(prev => prev + newValue);
    
//     // Change player
//     setCurrentPlayer(prev => {
//       switch(prev) {
//         case 'red': return 'blue';
//         case 'blue': return 'green';
//         case 'green': return 'yellow';
//         case 'yellow': return 'red';
//         default: return 'red';
//       }
//     });
//   };
  
//   // End the game
//   const endGame = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
    
//     setIsPlaying(false);
    
//     const endTime = new Date().getTime();
//     const totalPlayTimeSeconds = playTime;
    
//     // Calculate reward based on play time and score
//     let earnedReward = 0;
    
//     // Only reward if minimum play time is met
//     if (totalPlayTimeSeconds >= game.minPlayTime) {
//       // Base reward from game
//       earnedReward = game.reward;
      
//       // Additional reward based on play time (capped at 2x base reward)
//       const timeBonus = Math.min(
//         Math.floor(totalPlayTimeSeconds / 60) * game.rewardPerMinute,
//         game.reward
//       );
      
//       // Score bonus (up to 50% of base reward)
//       const scorePercentage = gameScore / game.maxScore;
//       const scoreBonus = Math.floor(game.reward * 0.5 * scorePercentage);
      
//       earnedReward += timeBonus + scoreBonus;
      
//       // Add to balance
//       setBalance(prev => prev + earnedReward);
      
//       // Add to game history
//       const gameRecord = {
//         id: game.id,
//         playTime: totalPlayTimeSeconds,
//         score: gameScore,
//         startTime: startTime,
//         endTime: endTime,
//         earnedReward: earnedReward
//       };
      
//       setGameHistory(prev => [gameRecord, ...prev]);
      
//       // Show completion alert
//       Alert.alert(
//         "Game Completed!",
//         `You played for ${Math.floor(totalPlayTimeSeconds / 60)}m ${totalPlayTimeSeconds % 60}s and scored ${gameScore} points.\n\nYou earned ₹${earnedReward}!`,
//         [{ text: "Great!", onPress: () => navigation.goBack() }]
//       );
//     } else {
//       // Not enough play time
//       Alert.alert(
//         "Play Time Too Short",
//         `You need to play for at least ${Math.floor(game.minPlayTime / 60)} minutes to earn rewards.`,
//         [{ text: "OK" }]
//       );
//     }
//   };
  
//   // Clean up timer on unmount
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);
  
//   // Format time as MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };
  
//   return (
//     <View style={styles.container}>
//       {isPlaying ? (
//         <View style={styles.gamePlayContainer}>
//           <View style={styles.gamePlayHeader}>
//             <View style={styles.gamePlayStat}>
//               <Text style={styles.gamePlayStatLabel}>Time</Text>
//               <Text style={styles.gamePlayStatValue}>{formatTime(playTime)}</Text>
//             </View>
//             <View style={styles.gamePlayStat}>
//               <Text style={styles.gamePlayStatLabel}>Score</Text>
//               <Text style={styles.gamePlayStatValue}>{gameScore}</Text>
//             </View>
//           </View>
          
//           <View style={styles.ludoBoard}>
//             <View style={styles.ludoBoardInner}>
//               {/* Red section (top-left) */}
//               <View style={[styles.ludoSection, styles.redSection]}>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.redToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.redToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.redToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.redToken]} />
//                 </View>
//               </View>
              
//               {/* Blue section (top-right) */}
//               <View style={[styles.ludoSection, styles.blueSection]}>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.blueToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.blueToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.blueToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.blueToken]} />
//                 </View>
//               </View>
              
//               {/* Green section (bottom-left) */}
//               <View style={[styles.ludoSection, styles.greenSection]}>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.greenToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.greenToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.greenToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.greenToken]} />
//                 </View>
//               </View>
              
//               {/* Yellow section (bottom-right) */}
//               <View style={[styles.ludoSection, styles.yellowSection]}>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.yellowToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.yellowToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.yellowToken]} />
//                 </View>
//                 <View style={styles.tokenSpot}>
//                   <View style={[styles.token, styles.yellowToken]} />
//                 </View>
//               </View>
              
//               {/* Center home */}
//               <View style={styles.ludoHome}>
//                 <View style={styles.ludoHomeInner}>
//                   <Text style={styles.ludoHomeText}>HOME</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
          
//           <View style={styles.diceContainer}>
//             <TouchableOpacity 
//               style={styles.diceButton}
//               onPress={rollDice}
//             >
//               <Text style={styles.diceValue}>{diceValue}</Text>
//             </TouchableOpacity>
//             <Text style={styles.diceText}>
//               {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn
//             </Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.endGameButton}
//             onPress={endGame}
//           >
//             <Text style={styles.endGameButtonText}>End Game</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <View style={styles.gameDetailCard}>
//           <Text style={styles.gameDetailTitle}>{game.title}</Text>
//           <Text style={styles.gameDetailDescription}>{game.description}</Text>
          
//           <View style={styles.gameDetailMeta}>
//             <Text style={styles.gameDetailMetaText}>Base Reward: ₹{game.reward}</Text>
//           </View>
          
//           <View style={styles.gameRules}>
//             <Text style={styles.gameRulesTitle}>How to Play:</Text>
//             <Text style={styles.gameRulesText}>• Roll the dice to move your tokens</Text>
//             <Text style={styles.gameRulesText}>• Get all your tokens to the center home</Text>
//             <Text style={styles.gameRulesText}>• Play for at least {Math.floor(game.minPlayTime / 60)} minutes to earn rewards</Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.playButton}
//             onPress={startGame}
//           >
//             <Text style={styles.playButtonText}>Play Now</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF8E1',
//     padding: 16,
//   },
//   gamePlayContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//   },
//   gamePlayHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F5F5DC',
//   },
//   gamePlayStat: {
//     alignItems: 'center',
//   },
//   gamePlayStatLabel: {
//     fontSize: 14,
//     color: '#795548',
//     marginBottom: 4,
//   },
//   gamePlayStatValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#5D4037',
//   },
//   ludoBoard: {
//     aspectRatio: 1,
//     backgroundColor: '#EFEFEF',
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 20,
//     alignSelf: 'center',
//     width: '100%',
//     maxWidth: 350,
//     borderWidth: 2,
//     borderColor: '#8B4513',
//   },
//   ludoBoardInner: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     position: 'relative',
//   },
//   ludoSection: {
//     width: '50%',
//     height: '50%',
//     padding: 10,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//   },
//   redSection: {
//     backgroundColor: '#FFCDD2',
//   },
//   blueSection: {
//     backgroundColor: '#BBDEFB',
//   },
//   greenSection: {
//     backgroundColor: '#C8E6C9',
//   },
//   yellowSection: {
//     backgroundColor: '#FFF9C4',
//   },
//   ludoHome: {
//     position: 'absolute',
//     width: '40%',
//     height: '40%',
//     top: '30%',
//     left: '30%',
//     backgroundColor: 'white',
//     borderWidth: 2,
//     borderColor: '#8B4513',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ludoHomeInner: {
//     width: '80%',
//     height: '80%',
//     backgroundColor: '#FFF8E1',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   ludoHomeText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#8B4513',
//   },
//   tokenSpot: {
//     width: '40%',
//     height: '40%',
//     borderRadius: 100,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: '5%',
//   },
//   activeTokenSpot: {
//     backgroundColor: 'rgba(0,0,0,0.1)',
//   },
//   token: {
//     width: '80%',
//     height: '80%',
//     borderRadius: 100,
//     borderWidth: 2,
//     borderColor: '#8B4513',
//   },
//   redToken: {
//     backgroundColor: 'red',
//   },
//   blueToken: {
//     backgroundColor: 'blue',
//   },
//   greenToken: {
//     backgroundColor: 'green',
//   },
//   yellowToken: {
//     backgroundColor: 'yellow',
//   },
//   diceContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   diceButton: {
//     width: 60,
//     height: 60,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#8B4513',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   diceValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#8B4513',
//   },
//   diceText: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#795548',
//   },
//   endGameButton: {
//     backgroundColor: '#FF6347',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   endGameButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   gameDetailCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     marginVertical: 20,
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   gameDetailTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#5D4037',
//   },
//   gameDetailDescription: {
//     fontSize: 16,
//     color: '#795548',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   gameDetailMeta: {
//     marginBottom: 16,
//   },
//   gameDetailMetaText: {
//     fontSize: 16,
//     color: '#A1887F',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   gameRules: {
//     backgroundColor: '#FFF3E0',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 20,
//     width: '100%',
//   },
//   gameRulesTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#5D4037',
//     marginBottom: 8,
//   },
//   gameRulesText: {
//     fontSize: 14,
//     color: '#795548',
//     marginBottom: 4,
//   },
//   playButton: {
//     backgroundColor: '#8B4513',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     alignItems: 'center',
//   },
//   playButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default LudoGameScreen;



import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { AppContext } from '../../App';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 320);
const CELL_SIZE = BOARD_SIZE / 15;

const LudoGameScreen = ({ route, navigation }) => {
  const { game } = route.params;
  const { balance, setBalance, gameHistory, setGameHistory } = useContext(AppContext);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [diceValue, setDiceValue] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [playerTokens, setPlayerTokens] = useState({
    red: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }],
    blue: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }],
    green: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }],
    yellow: [{ id: 0, position: -1 }, { id: 1, position: -1 }, { id: 2, position: -1 }, { id: 3, position: -1 }]
  });
  const [canMove, setCanMove] = useState(false);
  const [message, setMessage] = useState('');
  const timerRef = React.useRef(null);
  const computerMoveRef = React.useRef(null);
  
  // Define paths for each color
  const paths = {
    red: [
      { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 },
      { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 },
      { x: 0, y: 7 }, { x: 0, y: 6 },
      { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
      { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
      { x: 7, y: 0 }, { x: 8, y: 0 },
      { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 },
      { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
      { x: 14, y: 7 }, { x: 14, y: 8 },
      { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 },
      { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
      { x: 7, y: 14 }, { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }
    ],
    blue: [
      { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
      { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
      { x: 7, y: 0 }, { x: 8, y: 0 },
      { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 },
      { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
      { x: 14, y: 7 }, { x: 14, y: 8 },
      { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 },
      { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
      { x: 7, y: 14 }, { x: 6, y: 14 },
      { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 }, { x: 6, y: 8 },
      { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }
    ],
    green: [
      { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 },
      { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
      { x: 14, y: 7 }, { x: 14, y: 8 },
      { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 },
      { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
      { x: 7, y: 14 }, { x: 6, y: 14 },
      { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 }, { x: 6, y: 8 },
      { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 },
      { x: 0, y: 7 }, { x: 0, y: 6 },
      { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
      { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
      { x: 7, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }
    ],
    yellow: [
      { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }, { x: 9, y: 8 },
      { x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }, { x: 8, y: 12 }, { x: 8, y: 13 }, { x: 8, y: 14 },
      { x: 7, y: 14 }, { x: 6, y: 14 },
      { x: 6, y: 13 }, { x: 6, y: 12 }, { x: 6, y: 11 }, { x: 6, y: 10 }, { x: 6, y: 9 }, { x: 6, y: 8 },
      { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }, { x: 2, y: 8 }, { x: 1, y: 8 }, { x: 0, y: 8 },
      { x: 0, y: 7 }, { x: 0, y: 6 },
      { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
      { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
      { x: 7, y: 0 }, { x: 8, y: 0 },
      { x: 8, y: 1 }, { x: 8, y: 2 }, { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 8, y: 6 },
      { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }, { x: 14, y: 6 },
      { x: 14, y: 7 }, { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }
    ]
  };
  
  // Home paths for each color
  const homePaths = {
    red: [{ x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 }, { x: 7, y: 8 }],
    blue: [{ x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }],
    green: [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }],
    yellow: [{ x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 }, { x: 8, y: 7 }]
  };
  
    // Home positions for each color
    const homePositions = {
      red: [
        { x: 2, y: 11 }, { x: 2, y: 13 }, { x: 4, y: 11 }, { x: 4, y: 13 }
      ],
      blue: [
        { x: 2, y: 2 }, { x: 2, y: 4 }, { x: 4, y: 2 }, { x: 4, y: 4 }
      ],
      green: [
        { x: 11, y: 2 }, { x: 11, y: 4 }, { x: 13, y: 2 }, { x: 13, y: 4 }
      ],
      yellow: [
        { x: 11, y: 11 }, { x: 11, y: 13 }, { x: 13, y: 11 }, { x: 13, y: 13 }
      ]
    };
    
    // Start the game
    const startGame = () => {
      setIsPlaying(true);
      setStartTime(new Date().getTime());
      setPlayTime(0);
      setGameScore(0);
      setDiceValue(1);
      setCurrentPlayer('red');
      
      // Initialize tokens in home positions
      const initialTokens = {
        red: homePositions.red.map((pos, idx) => ({ id: idx, position: -1, x: pos.x, y: pos.y })),
        blue: homePositions.blue.map((pos, idx) => ({ id: idx, position: -1, x: pos.x, y: pos.y })),
        green: homePositions.green.map((pos, idx) => ({ id: idx, position: -1, x: pos.x, y: pos.y })),
        yellow: homePositions.yellow.map((pos, idx) => ({ id: idx, position: -1, x: pos.x, y: pos.y }))
      };
      
      setPlayerTokens(initialTokens);
      setMessage('Your turn! Roll the dice.');
      setCanMove(false);
      
      // Start timer to track play time
      timerRef.current = setInterval(() => {
        setPlayTime(prev => prev + 1);
      }, 1000);
    };
    
    // Roll the dice
    const rollDice = () => {
      if (currentPlayer !== 'red' || canMove) return; // Only player can roll when it's their turn
      
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      
      // Check if player can move any token
      const canMoveAnyToken = checkIfCanMove('red', newValue);
      
      if (canMoveAnyToken) {
        setCanMove(true);
        setMessage('Select a token to move');
      } else {
        setMessage(`No moves available. Switching to next player.`);
        // Switch to next player after a delay
        setTimeout(() => {
          switchToNextPlayer();
        }, 1500);
      }
    };
    
    // Check if player can move any token with current dice value
    const checkIfCanMove = (player, diceValue) => {
      const tokens = playerTokens[player];
      
      // If dice is 6, can bring a token out of home
      if (diceValue === 6 && tokens.some(token => token.position === -1)) {
        return true;
      }
      
      // Check if any token on board can move
      return tokens.some(token => token.position >= 0 && token.position < 57);
    };
    
    // Handle token selection and movement
    const handleTokenPress = (player, tokenId) => {
      if (!canMove || currentPlayer !== player) return;
      
      const tokens = [...playerTokens[player]];
      const tokenIndex = tokens.findIndex(t => t.id === tokenId);
      const token = tokens[tokenIndex];
      
      // If token is in home and dice is 6, bring it out
      if (token.position === -1 && diceValue === 6) {
        // Set token to starting position
        tokens[tokenIndex] = {
          ...token,
          position: 0,
          x: paths[player][0].x,
          y: paths[player][0].y
        };
        
        setPlayerTokens({...playerTokens, [player]: tokens});
        setGameScore(prev => prev + 5); // Bonus for bringing token out
        finishMove();
        return;
      }
      
      // If token is on board, move it
      if (token.position >= 0 && token.position < 57) {
        const newPos = token.position + diceValue;
        
        // Check if token completed a full round (reached home)
        if (newPos >= 57) {
          // Token reached final home
          tokens[tokenIndex] = {
            ...token,
            position: 100, // Special value for home
            x: 7,
            y: 7 // Center of board
          };
          setGameScore(prev => prev + 20); // Bonus for completing
        } else {
          // Move token along the path
          const pathPos = paths[player][newPos];
          tokens[tokenIndex] = {
            ...token,
            position: newPos,
            x: pathPos.x,
            y: pathPos.y
          };
          setGameScore(prev => prev + diceValue);
          
          // Check if landed on opponent's token
          checkForCapture(player, pathPos);
        }
        
        setPlayerTokens({...playerTokens, [player]: tokens});
        finishMove();
      }
    };
    
    // Check if landed on opponent's token
    const checkForCapture = (player, position) => {
      // For each opponent
      Object.entries(playerTokens).forEach(([opponent, tokens]) => {
        if (opponent !== player) {
          // Check each token
          tokens.forEach((token, index) => {
            // If opponent token is at same position, send it back home
            if (token.position >= 0 && token.x === position.x && token.y === position.y) {
              const homePos = homePositions[opponent][token.id];
              const newTokens = [...tokens];
              newTokens[index] = {
                ...token,
                position: -1,
                x: homePos.x,
                y: homePos.y
              };
              setPlayerTokens(prev => ({...prev, [opponent]: newTokens}));
              setGameScore(prev => prev + 10); // Bonus for capture
              setMessage(`You captured an opponent's token!`);
            }
          });
        }
      });
    };
    
    // Finish move and switch to next player
    const finishMove = () => {
      setCanMove(false);
      
      // If dice is 6, player gets another turn
      if (diceValue === 6) {
        setMessage('You rolled a 6! Roll again.');
      } else {
        setMessage('Switching to next player...');
        // Switch to next player after a delay
        setTimeout(() => {
          switchToNextPlayer();
        }, 1500);
      }
    };
    
    // Switch to next player
    const switchToNextPlayer = () => {
      setCurrentPlayer(prev => {
        switch(prev) {
          case 'red': return 'blue';
          case 'blue': return 'green';
          case 'green': return 'yellow';
          case 'yellow': return 'red';
          default: return 'red';
        }
      });
    };
    
    // Computer's turn
    useEffect(() => {
      if (!isPlaying) return;
      
      // If it's computer's turn
      if (currentPlayer !== 'red') {
        setMessage(`${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn...`);
        
        // Simulate computer thinking and rolling
        computerMoveRef.current = setTimeout(() => {
          // Roll dice
          const compDiceValue = Math.floor(Math.random() * 6) + 1;
          setDiceValue(compDiceValue);
          
          // Simulate computer move after a delay
          setTimeout(() => {
            const tokens = [...playerTokens[currentPlayer]];
            let moved = false;
            
            // Try to bring a token out if rolled 6
            if (compDiceValue === 6) {
              const homeTokenIndex = tokens.findIndex(token => token.position === -1);
              if (homeTokenIndex !== -1) {
                // Bring token out
                const startPos = paths[currentPlayer][0];
                tokens[homeTokenIndex] = {
                  ...tokens[homeTokenIndex],
                  position: 0,
                  x: startPos.x,
                  y: startPos.y
                };
                moved = true;
              }
            }
            
            // If didn't bring token out or no 6, try to move a token already on board
            if (!moved) {
              const onBoardTokens = tokens
                .map((token, idx) => ({token, idx}))
                .filter(item => item.token.position >= 0 && item.token.position < 57);
                
              if (onBoardTokens.length > 0) {
                // Pick random token to move
                const tokenToMove = onBoardTokens[Math.floor(Math.random() * onBoardTokens.length)];
                const newPos = tokenToMove.token.position + compDiceValue;
                
                if (newPos >= 57) {
                  // Token reached final home
                  tokens[tokenToMove.idx] = {
                    ...tokenToMove.token,
                    position: 100,
                    x: 7,
                    y: 7 // Center of board
                  };
                } else {
                  // Move token along the path
                  const pathPos = paths[currentPlayer][newPos];
                  tokens[tokenToMove.idx] = {
                    ...tokenToMove.token,
                    position: newPos,
                    x: pathPos.x,
                    y: pathPos.y
                  };
                  
                  // Check if computer captured player's token
                  Object.entries(playerTokens).forEach(([opponent, oppTokens]) => {
                    if (opponent !== currentPlayer) {
                      oppTokens.forEach((oppToken, index) => {
                        if (oppToken.position >= 0 && oppToken.x === pathPos.x && oppToken.y === pathPos.y) {
                          const homePos = homePositions[opponent][oppToken.id];
                          const newOppTokens = [...playerTokens[opponent]];
                          newOppTokens[index] = {
                            ...oppToken,
                            position: -1,
                            x: homePos.x,
                            y: homePos.y
                          };
                          setPlayerTokens(prev => ({...prev, [opponent]: newOppTokens}));
                          
                          if (opponent === 'red') {
                            setMessage(`${currentPlayer} captured your token!`);
                          }
                        }
                      });
                    }
                  });
                }
                moved = true;
              }
            }
            
            if (moved) {
              setPlayerTokens(prev => ({...prev, [currentPlayer]: tokens}));
            }
            
            // Switch to next player after computer's move
            setTimeout(() => {
              if (compDiceValue === 6) {
                // Computer gets another turn if rolled 6
                setMessage(`${currentPlayer} rolled a 6 and gets another turn!`);
                // Recursive call for another turn
                if (computerMoveRef.current) clearTimeout(computerMoveRef.current);
                computerMoveRef.current = setTimeout(() => {
                  // This will trigger the useEffect again for the same player
                  setCurrentPlayer(prev => prev);
                }, 1000);
              } else {
                switchToNextPlayer();
              }
            }, 1000);
          }, 1000);
        }, 1500);
      } else {
        setMessage('Your turn! Roll the dice.');
      }
      
      // Check if game is over (all tokens of any player reached home)
      const checkGameOver = () => {
        Object.entries(playerTokens).forEach(([player, tokens]) => {
          if (tokens.every(token => token.position === 100)) {
            const winner = player;
            endGame(winner === 'red');
          }
        });
      };
      
      checkGameOver();
      
      return () => {
        if (computerMoveRef.current) {
          clearTimeout(computerMoveRef.current);
        }
      };
    }, [currentPlayer, isPlaying]);
    
    // End the game
    const endGame = (playerWon = false) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (computerMoveRef.current) {
        clearTimeout(computerMoveRef.current);
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
        
        // Win bonus
        const winBonus = playerWon ? Math.floor(game.reward * 0.5) : 0;
        
        earnedReward += timeBonus + scoreBonus + winBonus;
        
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
          playerWon ? "You Won!" : "Game Completed!",
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
        if (computerMoveRef.current) {
          clearTimeout(computerMoveRef.current);
        }
      };
    }, []);
    
     // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Render a cell on the board
  const renderCell = (x, y) => {
    // Check if this is a home base cell
    const isRedHome = x >= 0 && x <= 5 && y >= 9 && y <= 14;
    const isBlueHome = x >= 0 && x <= 5 && y >= 0 && y <= 5;
    const isGreenHome = x >= 9 && x <= 14 && y >= 0 && y <= 5;
    const isYellowHome = x >= 9 && x <= 14 && y >= 9 && y <= 14;
    
    // Check if this is a path cell
    const isRedPath = homePaths.red.some(pos => pos.x === x && pos.y === y);
    const isBluePath = homePaths.blue.some(pos => pos.x === x && pos.y === y);
    const isGreenPath = homePaths.green.some(pos => pos.x === x && pos.y === y);
    const isYellowPath = homePaths.yellow.some(pos => pos.x === x && pos.y === y);
    
    // Check if this is a safe cell
    const isSafeCell = 
      (x === 6 && y === 2) || 
      (x === 2 && y === 6) || 
      (x === 8 && y === 12) || 
      (x === 12 && y === 8) ||
      (x === 6 && y === 1) || 
      (x === 1 && y === 6) || 
      (x === 8 && y === 13) || 
      (x === 13 && y === 8);
    
    // Center home
    const isCenterHome = x >= 6 && x <= 8 && y >= 6 && y <= 8;
    
    let cellStyle = [styles.cell];
    
    if (isRedHome) cellStyle.push(styles.redHome);
    else if (isBlueHome) cellStyle.push(styles.blueHome);
    else if (isGreenHome) cellStyle.push(styles.greenHome);
    else if (isYellowHome) cellStyle.push(styles.yellowHome);
    else if (isRedPath) cellStyle.push(styles.redPath);
    else if (isBluePath) cellStyle.push(styles.bluePath);
    else if (isGreenPath) cellStyle.push(styles.greenPath);
    else if (isYellowPath) cellStyle.push(styles.yellowPath);
    else if (isSafeCell) cellStyle.push(styles.safeCell);
    else if (isCenterHome) cellStyle.push(styles.centerHome);
    else cellStyle.push(styles.normalCell);
    
    return (
      <View key={`cell-${x}-${y}`} style={cellStyle}>
        {isSafeCell && <Text style={styles.safeCellText}>★</Text>}
      </View>
    );
  };
  
  // Render a token
  const renderToken = (token, player) => {
    const isActive = currentPlayer === player && canMove && 
      ((token.position === -1 && diceValue === 6) || (token.position >= 0 && token.position < 57));
    
    return (
      <TouchableOpacity
        key={`token-${player}-${token.id}`}
        style={[
          styles.token,
          styles[`${player}Token`],
          isActive && styles.activeToken
        ]}
        onPress={() => handleTokenPress(player, token.id)}
        disabled={!isActive}
      >
        <Text style={styles.tokenText}>{token.id + 1}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
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
          
          <Text style={styles.messageText}>{message}</Text>
          
          <View style={styles.boardContainer}>
            <View style={styles.ludoBoard}>
              {/* Generate the board grid */}
              {Array.from({ length: 15 }, (_, y) => (
                <View key={`row-${y}`} style={styles.boardRow}>
                  {Array.from({ length: 15 }, (_, x) => renderCell(x, y))}
                </View>
              ))}
              
              {/* Render tokens on the board */}
              {Object.entries(playerTokens).map(([player, tokens]) => 
                tokens.map(token => (
                  <View
                    key={`token-pos-${player}-${token.id}`}
                    style={[
                      styles.tokenPosition,
                      {
                        left: token.x * CELL_SIZE,
                        top: token.y * CELL_SIZE,
                      }
                    ]}
                  >
                    {renderToken(token, player)}
                  </View>
                ))
              )}
            </View>
          </View>
          
          <View style={styles.diceContainer}>
            <TouchableOpacity 
              style={[
                styles.diceButton,
                currentPlayer === 'red' && !canMove ? styles.activeDice : styles.inactiveDice
              ]}
              onPress={rollDice}
              disabled={currentPlayer !== 'red' || canMove}
            >
              <Text style={styles.diceValue}>{diceValue}</Text>
            </TouchableOpacity>
            <Text style={styles.diceText}>
              {currentPlayer === 'red' && !canMove ? 'Tap to Roll' : 'Wait for your turn'}
            </Text>
          </View>
          
          <View style={styles.playerIndicator}>
            <View style={[styles.playerIndicatorDot, { backgroundColor: currentPlayer }]} />
            <Text style={styles.playerIndicatorText}>
              {currentPlayer === 'red' ? 'Your Turn' : `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s Turn`}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.endGameButton}
            onPress={() => endGame()}
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
            <Text style={styles.gameRulesTitle}>How to Play:</Text>
            <Text style={styles.gameRulesText}>• Roll the dice to move your tokens</Text>
            <Text style={styles.gameRulesText}>• Roll a 6 to bring tokens out of home</Text>
            <Text style={styles.gameRulesText}>• Capture opponent tokens by landing on them</Text>
            <Text style={styles.gameRulesText}>• Get all your tokens to the center home to win</Text>
            <Text style={styles.gameRulesText}>• Play for at least {Math.floor(game.minPlayTime / 60)} minutes to earn rewards</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={startGame}
          >
            <Text style={styles.playButtonText}>Play Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  gamePlayContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
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
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#5D4037',
    fontWeight: 'bold',
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ludoBoard: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B4513',
    position: 'relative',
    flexDirection: 'column',
  },
  boardRow: {
    flexDirection: 'row',
    height: CELL_SIZE,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  redHome: {
    backgroundColor: '#FFCDD2',
  },
  blueHome: {
    backgroundColor: '#BBDEFB',
  },
  greenHome: {
    backgroundColor: '#C8E6C9',
  },
  yellowHome: {
    backgroundColor: '#FFF9C4',
  },
  redPath: {
    backgroundColor: '#EF9A9A',
  },
  bluePath: {
    backgroundColor: '#90CAF9',
  },
  greenPath: {
    backgroundColor: '#A5D6A7',
  },
  yellowPath: {
    backgroundColor: '#FFF59D',
  },
  safeCell: {
    backgroundColor: '#E1BEE7',
  },
  centerHome: {
    backgroundColor: '#FFFFFF',
  },
  normalCell: {
    backgroundColor: '#F5F5F5',
  },
  safeCellText: {
    fontSize: 12,
    color: '#9C27B0',
  },
  tokenPosition: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  token: {
    width: CELL_SIZE * 0.8,
    height: CELL_SIZE * 0.8,
    borderRadius: CELL_SIZE * 0.4,
    borderWidth: 2,
    borderColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  redToken: {
    backgroundColor: 'red',
  },
  blueToken: {
    backgroundColor: 'blue',
  },
  greenToken: {
    backgroundColor: 'green',
  },
  yellowToken: {
    backgroundColor: 'yellow',
  },
  activeToken: {
    borderWidth: 3,
    borderColor: 'gold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  diceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  diceButton: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  activeDice: {
    borderColor: '#8B4513',
    backgroundColor: '#FFF3E0',
  },
  inactiveDice: {
    borderColor: '#A1887F',
    backgroundColor: '#F5F5DC',
  },
  diceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  diceText: {
    marginTop: 8,
    fontSize: 14,
    color: '#795548',
  },
  playerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  playerIndicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  playerIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D4037',
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
  gameDetailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
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

export default LudoGameScreen;

import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc, addDoc, writeBatch } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

export interface GameStats {
  totalPoints: number;
  gamesWon: number;
  streak: number;
  trophies: number;
  lastPlayedDate?: string;
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: string;
  unlocked?: boolean;
  progress?: string;
}

export interface UserTrophy {
  userId: string;
  trophyId: string;
  progress: number;
  unlocked: boolean;
  lastUpdated: Date;
}

export interface GameState {
  userId: string;
  wordId: string;
  attempts: number;
  hintsUsed: number;
  gameStatus: 'playing' | 'won' | 'lost';
  points: number;
  lastPlayed: string;
}

export const getGameStats = async (userId: string): Promise<GameStats> => {
  try {
    const statsDoc = await getDoc(doc(db, 'gameStats', userId));
    if (statsDoc.exists()) {
      return statsDoc.data() as GameStats;
    }
    // Si no existe, crear estadísticas iniciales
    const initialStats: GameStats = {
      totalPoints: 0,
      gamesWon: 0,
      streak: 0,
      trophies: 0
    };
    await setDoc(doc(db, 'gameStats', userId), initialStats);
    return initialStats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

export async function updateGameStats(
  userId: string,
  points: number,
  won: boolean
): Promise<GameStats> {
  const db = getFirestore();
  const statsRef = doc(db, "gameStats", userId);
  const statsDoc = await getDoc(statsRef);

  let stats: GameStats;
  if (!statsDoc.exists()) {
    stats = {
      totalPoints: points,
      gamesWon: won ? 1 : 0,
      streak: won ? 1 : 0,
      trophies: 0,
      lastPlayedDate: new Date().toISOString().split("T")[0],
    };
    await setDoc(statsRef, stats);
  } else {
    const currentStats = statsDoc.data() as GameStats;
    const lastPlayed = currentStats.lastPlayedDate ? new Date(currentStats.lastPlayedDate) : new Date();
    const today = new Date();
    const isConsecutiveDay = 
      lastPlayed.getDate() === today.getDate() - 1 &&
      lastPlayed.getMonth() === today.getMonth() &&
      lastPlayed.getFullYear() === today.getFullYear();

    stats = {
      totalPoints: (currentStats.totalPoints || 0) + points,
      gamesWon: (currentStats.gamesWon || 0) + (won ? 1 : 0),
      streak: won ? (isConsecutiveDay ? (currentStats.streak || 0) + 1 : 1) : 0,
      trophies: currentStats.trophies || 0,
      lastPlayedDate: today.toISOString().split("T")[0],
    };
    await updateDoc(statsRef, { ...stats });
  }

  // Actualizar progreso de trofeos si el usuario ganó
  if (won) {
    await updateTrophyProgress(userId, "games");
  }

  return stats;
}

export async function getTrophies(userId: string): Promise<(Trophy & { progress: string; unlocked: boolean })[]> {
  const db = getFirestore();
  
  // Obtener todos los trofeos base
  const trophiesSnapshot = await getDocs(collection(db, "trophies"));
  const trophies = trophiesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Trophy));

  // Obtener el progreso del usuario para cada trofeo
  const userTrophiesSnapshot = await getDocs(
    query(collection(db, "userTrophies"), where("userId", "==", userId))
  );
  const userTrophies = userTrophiesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as unknown as UserTrophy));

  // Combinar la información
  return trophies.map(trophy => {
    const userTrophy = userTrophies.find(ut => ut.trophyId === trophy.id);
    return {
      ...trophy,
      progress: userTrophy ? `${userTrophy.progress}/${trophy.requirement}` : `0/${trophy.requirement}`,
      unlocked: userTrophy?.unlocked || false
    };
  });
}

export async function updateTrophyProgress(userId: string, trophyType: string, increment: number = 1): Promise<void> {
  const db = getFirestore();
  
  // Obtener trofeos del tipo especificado
  const trophiesSnapshot = await getDocs(
    query(collection(db, "trophies"), where("type", "==", trophyType))
  );
  
  const batch = writeBatch(db);
  
  for (const trophyDoc of trophiesSnapshot.docs) {
    const trophy = trophyDoc.data() as Trophy;
    const userTrophyRef = doc(db, "userTrophies", `${userId}_${trophy.id}`);
    const userTrophyDoc = await getDoc(userTrophyRef);
    
    if (!userTrophyDoc.exists()) {
      // Crear nuevo registro de trofeo de usuario
      batch.set(userTrophyRef, {
        userId,
        trophyId: trophy.id,
        progress: increment,
        unlocked: increment >= trophy.requirement,
        lastUpdated: new Date()
      });
    } else {
      const userTrophy = userTrophyDoc.data() as UserTrophy;
      const newProgress = userTrophy.progress + increment;
      
      batch.update(userTrophyRef, {
        progress: newProgress,
        unlocked: newProgress >= trophy.requirement,
        lastUpdated: new Date()
      });
    }
  }
  
  await batch.commit();
}

export const getGameState = async (userId: string): Promise<GameState | null> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const gameStateQuery = query(
      collection(db, 'gameStates'),
      where('userId', '==', userId),
      where('lastPlayed', '==', today)
    );
    const snapshot = await getDocs(gameStateQuery);
    
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as GameState;
  } catch (error) {
    console.error('Error al obtener estado del juego:', error);
    throw error;
  }
};

export const updateGameState = async (gameState: GameState) => {
  try {
    const gameStateQuery = query(
      collection(db, 'gameStates'),
      where('userId', '==', gameState.userId),
      where('lastPlayed', '==', gameState.lastPlayed)
    );
    const snapshot = await getDocs(gameStateQuery);
    
    if (snapshot.empty) {
      await addDoc(collection(db, 'gameStates'), gameState);
    } else {
      // Convertir a objeto plano
      const plainState = { ...gameState };
      await updateDoc(doc(db, 'gameStates', snapshot.docs[0].id), plainState);
    }
  } catch (error) {
    console.error('Error al actualizar estado del juego:', error);
    throw error;
  }
};

export async function initializeTrophies(): Promise<void> {
  const db = getFirestore();
  
  const baseTrophies = [
    {
      id: "1",
      name: "Principiante",
      description: "Gana 10 juegos",
      icon: "🥉",
      requirement: 10,
      type: "games"
    },
    {
      id: "2",
      name: "Experto",
      description: "Gana 25 juegos",
      icon: "🥈",
      requirement: 25,
      type: "games"
    },
    {
      id: "3",
      name: "Maestro",
      description: "Gana 50 juegos",
      icon: "🥇",
      requirement: 50,
      type: "games"
    }
  ];

  // Verificar si ya existen los trofeos
  const existingTrophies = await getDocs(collection(db, "trophies"));
  if (!existingTrophies.empty) {
    return; // Los trofeos ya existen, no hacer nada
  }

  const batch = writeBatch(db);
  
  for (const trophy of baseTrophies) {
    const trophyRef = doc(db, "trophies", trophy.id);
    batch.set(trophyRef, trophy);
  }
  
  await batch.commit();
} 
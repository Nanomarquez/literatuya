import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  updateDoc,
  increment,
  getDoc,
  deleteDoc
} from 'firebase/firestore';

export interface Definition {
  id: string;
  word: string;
  wordLowerCase: string;
  raeDefinition?: string;
  literaturiaDefinition: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  category: string;
  isOfficial: boolean;
  votes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  definitionId: string;
  content: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  createdAt: string;
}

export const createDefinition = async (definition: Omit<Definition, 'id' | 'votes' | 'comments' | 'createdAt' | 'updatedAt' | 'wordLowerCase'>) => {
  try {
    const docRef = await addDoc(collection(db, 'definitions'), {
      ...definition,
      wordLowerCase: definition.word.toLowerCase(),
      votes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear la definición:', error);
    throw error;
  }
};

export const getDefinitions = async (filters?: {
  category?: string;
  isOfficial?: boolean;
  search?: string;
  trending?: boolean;
}) => {
  try {
    const q = collection(db, 'definitions');
    const constraints = [];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters?.isOfficial !== undefined) {
      constraints.push(where('isOfficial', '==', filters.isOfficial));
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      constraints.push(where('wordLowerCase', '>=', searchTerm));
      constraints.push(where('wordLowerCase', '<=', searchTerm + '\uf8ff'));
    }

    if (filters?.trending) {
      constraints.push(orderBy('votes', 'desc'));
      constraints.push(limit(10));
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    const q2 = query(q, ...constraints);
    const querySnapshot = await getDocs(q2);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Definition[];
  } catch (error) {
    console.error('Error al obtener definiciones:', error);
    throw error;
  }
};

export const voteDefinition = async (definitionId: string, userId: string) => {
  try {
    // Primero verificamos si el usuario ya votó
    const voteQuery = query(
      collection(db, 'votes'),
      where('definitionId', '==', definitionId),
      where('userId', '==', userId)
    );
    const voteSnapshot = await getDocs(voteQuery);
    
    const definitionRef = doc(db, 'definitions', definitionId);
    
    if (voteSnapshot.empty) {
      // Si no ha votado, agregamos el voto
      await addDoc(collection(db, 'votes'), {
        definitionId,
        userId,
        createdAt: new Date().toISOString()
      });
      await updateDoc(definitionRef, {
        votes: increment(1)
      });
      return true; // indicador de que se agregó el voto
    } else {
      // Si ya votó, removemos el voto
      const voteDoc = voteSnapshot.docs[0];
      await deleteDoc(doc(db, 'votes', voteDoc.id));
      await updateDoc(definitionRef, {
        votes: increment(-1)
      });
      return false; // indicador de que se removió el voto
    }
  } catch (error) {
    throw error;
  }
};

export const hasUserVoted = async (definitionId: string, userId: string): Promise<boolean> => {
  try {
    const voteQuery = query(
      collection(db, 'votes'),
      where('definitionId', '==', definitionId),
      where('userId', '==', userId)
    );
    const voteSnapshot = await getDocs(voteQuery);
    return !voteSnapshot.empty;
  } catch (error) {
    throw error;
  }
};

export const addComment = async (definitionId: string, content: string, user: { uid: string; displayName: string | null; photoURL: string | null }) => {
  try {
    const commentRef = await addDoc(collection(db, 'comments'), {
      definitionId,
      content,
      userId: user.uid,
      userName: user.displayName || 'Anónimo',
      userPhoto: user.photoURL || null,
      createdAt: new Date().toISOString(),
    });

    const definitionRef = doc(db, 'definitions', definitionId);
    await updateDoc(definitionRef, {
      comments: increment(1)
    });

    return commentRef.id;
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    throw error;
  }
};

export const getDefinition = async (id: string): Promise<Definition> => {
  try {
    const docRef = doc(db, 'definitions', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Definición no encontrada');
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Definition;
  } catch (error) {
    console.error('Error al obtener la definición:', error);
    throw error;
  }
};

export const getComments = async (definitionId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('definitionId', '==', definitionId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    throw error;
  }
};

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
  getDoc
} from 'firebase/firestore';

export interface Definition {
  id: string;
  word: string;
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

export const createDefinition = async (definition: Omit<Definition, 'id' | 'votes' | 'comments' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'definitions'), {
      ...definition,
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
      constraints.push(where('word', '>=', filters.search));
      constraints.push(where('word', '<=', filters.search + '\uf8ff'));
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

export const voteDefinition = async (definitionId: string) => {
  try {
    const definitionRef = doc(db, 'definitions', definitionId);
    await updateDoc(definitionRef, {
      votes: increment(1)
    });
  } catch (error) {
    console.error('Error al votar la definición:', error);
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

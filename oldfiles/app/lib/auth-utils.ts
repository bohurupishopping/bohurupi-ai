import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export const isAdmin = async (uid: string): Promise<boolean> => {
  const role = await getUserRole(uid);
  return role === 'admin';
}; 
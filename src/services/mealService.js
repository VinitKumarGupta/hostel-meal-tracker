import { 
  doc, 
  collection, 
  updateDoc, 
  increment, 
  onSnapshot, 
  getDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Increment the specific meal count of a roommate by 1.
 * @param {string} uid - The user ID of the roommate
 * @param {'breakfast' | 'lunch' | 'dinner'} mealType - The type of meal
 */
export const incrementMeal = async (uid, mealType) => {
  if (!uid || !['breakfast', 'lunch', 'dinner'].includes(mealType)) {
    throw new Error("Invalid parameters provided for incrementMeal");
  }
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    [mealType]: increment(1)
  });
};

/**
 * Decrement the specific meal count of a roommate by 1.
 * Prevents count from going below 0.
 * @param {string} uid - The user ID of the roommate
 * @param {'breakfast' | 'lunch' | 'dinner'} mealType - The type of meal
 */
export const decrementMeal = async (uid, mealType) => {
  if (!uid || !['breakfast', 'lunch', 'dinner'].includes(mealType)) {
    throw new Error("Invalid parameters provided for decrementMeal");
  }
  const userDocRef = doc(db, 'users', uid);
  
  // Fetch current data to ensure we do not decrement below 0
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    const currentCount = docSnap.data()[mealType] || 0;
    if (currentCount > 0) {
      await updateDoc(userDocRef, {
        [mealType]: increment(-1)
      });
    } else {
      throw new Error("Count cannot go below 0");
    }
  } else {
    throw new Error("User document does not exist");
  }
};

/**
 * Reset the specific meal count of a roommate to 0.
 * @param {string} uid - The user ID of the roommate
 * @param {'breakfast' | 'lunch' | 'dinner'} mealType - The type of meal
 */
export const resetMeal = async (uid, mealType) => {
  if (!uid || !['breakfast', 'lunch', 'dinner'].includes(mealType)) {
    throw new Error("Invalid parameters provided for resetMeal");
  }
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    [mealType]: 0
  });
};

/**
 * Subscribe to the users collection in real time.
 * @param {function} callback - Callback function called with the roommate list on updates
 * @returns {function} unsubscribe function
 */
export const subscribeToRoommates = (callback) => {
  const usersCollection = collection(db, 'users');
  // Order users by creation date or name to keep layout stable
  const q = query(usersCollection, orderBy('name', 'asc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const roommates = [];
    querySnapshot.forEach((doc) => {
      roommates.push({ id: doc.id, ...doc.data() });
    });
    callback(roommates);
  }, (error) => {
    console.error("Firestore realtime subscription error:", error);
  });
};

/**
 * Reset all roommates' meal counts to 0.
 * @param {Array} roommates - The list of all roommates to reset
 */
export const resetAllRoommateMeals = async (roommates) => {
  if (!Array.isArray(roommates) || roommates.length === 0) return;
  const batch = writeBatch(db);
  roommates.forEach((roommate) => {
    const userDocRef = doc(db, 'users', roommate.uid);
    batch.update(userDocRef, {
      breakfast: 0,
      lunch: 0,
      dinner: 0
    });
  });
  await batch.commit();
};


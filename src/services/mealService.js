import { 
  doc, 
  collection, 
  updateDoc, 
  increment, 
  onSnapshot, 
  getDoc,
  query,
  orderBy,
  writeBatch,
  setDoc,
  deleteDoc,
  getDocs,
  limit,
  serverTimestamp,
  addDoc
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

  // Log the activity
  const logsCollectionRef = collection(db, 'users', uid, 'logs');
  const newLogDocRef = doc(logsCollectionRef);
  await setDoc(newLogDocRef, {
    id: newLogDocRef.id,
    mealType,
    action: 'add',
    timestamp: serverTimestamp()
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

      // Find the most recent log of this mealType and delete it
      // Filter in-memory to avoid needing composite Firestore indexes
      const logsCollectionRef = collection(db, 'users', uid, 'logs');
      const q = query(logsCollectionRef, orderBy('timestamp', 'desc'), limit(20));
      const querySnap = await getDocs(q);
      const matchDoc = querySnap.docs.find((d) => d.data().mealType === mealType);
      if (matchDoc) {
        await deleteDoc(matchDoc.ref);
      }
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

  // Delete all logs for this mealType
  const logsCollectionRef = collection(db, 'users', uid, 'logs');
  const q = query(logsCollectionRef);
  const querySnap = await getDocs(q);
  const batch = writeBatch(db);
  let count = 0;
  querySnap.forEach((d) => {
    if (d.data().mealType === mealType) {
      batch.delete(d.ref);
      count++;
    }
  });
  if (count > 0) {
    await batch.commit();
  }
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
 * Reset all roommates' meal counts to 0 (keeps logs intact).
 * @param {Array} roommates - The list of all roommates to reset
 */
export const resetAllRoommateMeals = async (roommates) => {
  if (!Array.isArray(roommates) || roommates.length === 0) return;
  const batch = writeBatch(db);
  
  // Reset counts for all roommates
  roommates.forEach((roommate) => {
    const userDocRef = doc(db, 'users', roommate.id);
    batch.update(userDocRef, {
      breakfast: 0,
      lunch: 0,
      dinner: 0
    });
  });
  
  await batch.commit();
};

/**
 * Subscribe to the current user's logs in real time.
 * @param {string} uid - The user ID of the roommate
 * @param {function} callback - Callback function called with the logs list
 * @returns {function} unsubscribe function
 */
export const subscribeToUserLogs = (uid, callback) => {
  const logsCollectionRef = collection(db, 'users', uid, 'logs');
  const q = query(logsCollectionRef, orderBy('timestamp', 'desc'), limit(50));
  
  return onSnapshot(q, (querySnapshot) => {
    const logs = [];
    querySnapshot.forEach((d) => {
      logs.push({ id: d.id, ...d.data() });
    });
    callback(logs);
  }, (error) => {
    console.error("Firestore realtime logs subscription error:", error);
  });
};

/**
 * Subscribe to all active notices in real time (ordered by creation date desc).
 * @param {function} callback - Callback function called with list of notices
 * @returns {function} unsubscribe function
 */
export const subscribeToActiveNotices = (callback) => {
  const noticesCollectionRef = collection(db, 'notices');
  const q = query(noticesCollectionRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const notices = [];
    querySnapshot.forEach((d) => {
      notices.push({ id: d.id, ...d.data() });
    });
    callback(notices);
  }, (error) => {
    console.error("Firestore realtime notices subscription error:", error);
  });
};

/**
 * Add a new notice announcement.
 * @param {string} text - Notice text
 */
export const addNotice = async (text) => {
  const noticesCollectionRef = collection(db, 'notices');
  await addDoc(noticesCollectionRef, {
    text: text.trim(),
    createdAt: serverTimestamp()
  });
};

/**
 * Delete a specific notice.
 * @param {string} noticeId - Notice document ID
 */
export const deleteNotice = async (noticeId) => {
  if (!noticeId) return;
  const noticeDocRef = doc(db, 'notices', noticeId);
  await deleteDoc(noticeDocRef);
};


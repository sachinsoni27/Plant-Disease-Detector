// Notification Service for managing app-wide alerts and recommendations
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const sendNotification = async (userId, title, message, type = 'info', actionUrl = null) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type, // 'info' | 'warning' | 'success' | 'danger'
      actionUrl,
      read: false,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const subscribeToNotifications = (userId, callback) => {
  if (!userId) return () => {};

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(notifications);
  });
};

export const markAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

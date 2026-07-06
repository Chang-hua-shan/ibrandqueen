/**
 * iBrandQueen Firebase Configuration and Initialization
 */

const firebaseConfig = {
  apiKey: "AIzaSyB_pqHWiNjn2hDC5RXKPmcswykuggbYreA",
  authDomain: "ibrandqueen-auth.firebaseapp.com",
  projectId: "ibrandqueen-auth",
  storageBucket: "ibrandqueen-auth.firebasestorage.app",
  messagingSenderId: "749581325056",
  appId: "1:749581325056:web:265d092110516d1d8e19e5",
  measurementId: "G-FRYY9FRP7B"
};

// Global handles
let firebaseApp = null;
let db = null;
let useFirebase = false;

// Initialize if key is set and valid
if (
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.apiKey.trim() !== ""
) {
  try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    useFirebase = true;
    console.log("[Firebase] Membership Auth and Firestore database initialized successfully.");
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
  }
} else {
  console.log("[Firebase] Using local simulation mode. Add config keys in firebase-config.js to connect.");
}

/**
 * Helper to fetch subscription tier.
 * Fallback to localStorage if Firebase not connected.
 */
async function getSubscriptionTier(user) {
  if (!user) return 'Free';
  
  if (useFirebase && db) {
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        return doc.data().tier || 'Free';
      } else {
        // Create user doc if not exists
        await db.collection('users').doc(user.uid).set({
          email: user.email,
          tier: 'Free',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return 'Free';
      }
    } catch (e) {
      console.error("[Firebase] Error fetching user tier from Firestore:", e);
      return 'Free';
    }
  } else {
    // Local simulation fallback
    return localStorage.getItem(`aiu_tier_${user.email}`) || 'Free';
  }
}

/**
 * Helper to update subscription tier.
 */
async function updateSubscriptionTier(user, tier) {
  if (!user) return false;
  
  if (useFirebase && db) {
    try {
      await db.collection('users').doc(user.uid).set({
        tier: tier,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`[Firebase] User tier updated to: ${tier}`);
      return true;
    } catch (e) {
      console.error("[Firebase] Error updating user tier in Firestore:", e);
      return false;
    }
  } else {
    // Local simulation fallback
    localStorage.setItem(`aiu_tier_${user.email}`, tier);
    console.log(`[Local Simulation] User tier updated to: ${tier}`);
    return true;
  }
}

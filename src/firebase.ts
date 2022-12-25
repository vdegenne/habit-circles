// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, getFirestore, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { habitConverter } from './objects/Habit.js';
import { setPage, setUser } from './redux/slices/app.js';
import { setHabits } from './redux/slices/data.js';
import { store } from './redux/store.js';
import { sleep } from './utils.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTVVVvfjQgMlDoyHLZ53I6qfmkEaW_CyQ",
  authDomain: "habit-circles-962f5.firebaseapp.com",
  projectId: "habit-circles-962f5",
  storageBucket: "habit-circles-962f5.appspot.com",
  messagingSenderId: "297586235342",
  appId: "1:297586235342:web:520c83572387ec4849bd9f"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)


// INITIAL DATA
// ;(async function () {
//   const icons = await (await fetch('./icons.json')).json() as any[]

//   let batch = writeBatch(db)

//   let icon, count = 0
//   while (icons.length > 0) {
//     icon = icons.shift()
//     batch.set(doc(db, `icons/${icon.id}`), { name: icon.n })
//     if (++count >= 500 || icons.length == 0) {
//       batch.commit()
//       batch = writeBatch(db)
//       count = 0;
//     }
//   }
//   batch.commit()
// })()

let habitsCollectionUnsubscribe: Unsubscribe|undefined

onAuthStateChanged(auth, async (user) => {
  if (user) {
    store.dispatch(setUser({
      uid: user.uid,
      displayName: user.displayName!,
      photoURL: user.photoURL!,
    }))
    // fetch the data
    habitsCollectionUnsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'habits').withConverter(habitConverter),
      (snapshot) => {
        store.dispatch(setHabits(snapshot.docs.map(doc => doc.data())))
      }
    )
    store.dispatch(setPage(''))
  }
  else {
    store.dispatch(setUser(undefined))
    if (habitsCollectionUnsubscribe) {
      habitsCollectionUnsubscribe()
      habitsCollectionUnsubscribe = undefined
    }
  }
})
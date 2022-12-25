import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase.js'
import { Habit, habitConverter } from './objects/Habit.js'
import { store } from './redux/store.js'


export const Firestore = class {

  static async createHabit (habit: Habit) {
    const user = store.getState().app.user
    if (user == undefined) {
      throw new Error('Needs authentication')
    }

    const docRef = await addDoc(
      collection(db, 'users', user.uid, 'habits').withConverter(habitConverter),
      habit
    )
    // docRef.id
  }

  static async deleteHabit (habit: Habit) {
    const user = store.getState().app.user
    if (user == undefined) {
      throw new Error('Needs authentication')
    }
    if (habit.id == undefined) {
      throw new Error('The document needs to contain its id')
    }

    await deleteDoc(doc(db, `users/${user.uid}/habits/${habit.id}`))
  }


  static async touchHabit (habit: Habit) {
    const user = store.getState().app.user
    if (user == undefined) {
      throw new Error('Needs authentication')
    }
    if (habit.id == undefined) {
      throw new Error('The document needs to contain its id')
    }

    await updateDoc(
      doc(db, `users/${user.uid}/habits/${habit.id}`).withConverter(habitConverter),
      {
        touch: Date.now()
      }
    )
  }
}
import { FirestoreDataConverter } from 'firebase/firestore';
import { getIconName } from '../icons.js';
import ms from 'ms'
import { Firestore } from '../firestore.js';

export class Habit {
  public id?: string;
  readonly unit: 'd'|'h'|'m'
  readonly length: number
  readonly iconName: string
  public touch: number;

  constructor (readonly name: string, readonly frequency: string, readonly icon: number, readonly color: string, touch: number) {
    this.touch = touch
    this.length = parseInt(this.frequency)
    this.unit = this.frequency.replace(/[0-9]*/, '') as Habit['unit']
    this.iconName = getIconName(this.icon)!
  }

  getAbstinenceTime () {
    return Date.now() - this.touch
  }

  getRemainingTime () {
    return ms(this.frequency) - this.getAbstinenceTime()
  }

  getProcrastinationTime () {
    return this.getRemainingTime() * -1
  }

  get isNew () {
    return this.touch == 0
  }

  isPermitted () {
    return this.getAbstinenceTime() >= ms(this.frequency)
  }


  async destroy () {
    await Firestore.deleteHabit(this)
  }
  async updateTouchTime () {
    await Firestore.touchHabit(this)
  }
}


export const habitConverter: FirestoreDataConverter<Habit> =
{
  toFirestore: (habit) => {
    return {
      name: habit.name,
      frequency: habit.frequency,
      icon: habit.icon,
      color: habit.color,
      touch: habit.touch
    }
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options) as Habit
    const habit = new Habit(data.name, data.frequency, data.icon, data.color, data.touch)
    habit.id = snapshot.id
    return habit
  }
}
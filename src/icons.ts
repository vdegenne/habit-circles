import iconsSet from '../docs/icons.json'

export function getIconId (iconName: string) {
  return iconsSet.find(i => i.n == iconName)?.id
}

export function getIconName (iconId: number) {
  return iconsSet.find(i => i.id == iconId)?.n
}

export function iconExists (icon: string|number) {
  if (typeof icon == 'string') {
    return iconsSet.some(i => i.n == icon)
  }
  else if (typeof icon == 'number') {
    return iconsSet.some(i => i.id == icon)
  }
  else {
    throw new Error('Icon type not recognized')
  }
}


export const iconNameValidationPattern = iconsSet.map(i => i.n).join('|')
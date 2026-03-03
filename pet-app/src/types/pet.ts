export type PetType = 'cat' | 'dog' | 'other'
export type PetGender = 'male' | 'female'
export type NeuterStatus = 'neutered' | 'not_neutered'

export interface PetProfile {
  id: string
  avatar: string
  name: string
  type: PetType | null
  breed: string | null
  gender: PetGender | null
  neuterStatus: NeuterStatus | null
  birthDate: string | null
  arrivalDate: string | null
  age: string | null
  weight: number | null
  createdAt: string
  updatedAt: string
}

export interface BreedItem {
  name: string
  pinyin: string
  hot?: boolean
}

export interface BreedGroup {
  letter: string
  breeds: BreedItem[]
}

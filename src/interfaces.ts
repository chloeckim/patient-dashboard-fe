import { Timestamp } from "firebase/firestore"

export type DocType = {
  uid: string
  status: string
  firstName: string
  middleName?: string
  lastName: string
  dob: Timestamp
  addresses: AddressType[]
}

export type ColType = {
  key: string
  name: string
  type: string
}

export type AddressType = {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipcode: string
}

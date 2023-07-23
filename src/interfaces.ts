import { Timestamp } from "firebase/firestore"

export type DocType = {
  uid: string
  status: string
  firstName: string
  middleName: string
  lastName: string
  dob: Timestamp | null
  addresses: AddressType[]
}

export type RowType = {
  id: string
  uid?: string
  status?: string
  firstName?: string
  middleName?: string
  lastName?: string
  dob?: Timestamp
  addresses?: AddressType[]
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
  editing?: boolean
}

export const INITIAL_ADDRESS: AddressType = {
  addressLine1: "",
  city: "",
  state: "",
  zipcode: "",
  editing: true,
}

export const INITIAL_DOC: DocType = {
  uid: "",
  status: "Inquiry",
  firstName: "",
  middleName: "",
  lastName: "",
  dob: null,
  addresses: [INITIAL_ADDRESS],
}

export const toDoc = (row: RowType): DocType => {
  return {
    uid: row.uid || "",
    status: row.status || "",
    firstName: row.firstName || "",
    middleName: row.middleName || "",
    lastName: row.lastName || "",
    dob: row.dob || null,
    addresses: row.addresses || [],
  }
}

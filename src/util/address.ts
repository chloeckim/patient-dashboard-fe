export type AddressType = {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipcode: string
}

export const parseAddress = (addressString: string): AddressType | null => {
  // Example address: 7413 Aufderhar Flat, Suite 477, 31450, East Joy, Ohio, United States
  const components: string[] = addressString.split(",")
  if (components.length !== 6) {
    console.error("Address in wrong format", addressString)
    return null
  }
  return {
    addressLine1: components[0],
    addressLine2: components[1],
    city: components[3],
    state: components[4],
    zipcode: components[2],
  }
}

import { AddressType } from "../interfaces"

const STATES: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  newhampshire: "NH",
  newjersey: "NJ",
  newmexico: "NM",
  newyork: "NY",
  northcarolina: "NC",
  northdakota: "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  rhodeisland: "RI",
  southcarolina: "SC",
  southdakota: "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  westvirginia: "WV",
  wisconsin: "WI",
  wyoming: "WY",
}

export const parseAddress = (addressString: string): AddressType | null => {
  // Example address: 7413 Aufderhar Flat, Suite 477, 31450, East Joy, Ohio, United States
  const components: string[] = addressString.split(",").map((val) => val.trim())
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

export const stringifyAddress = (address: AddressType) => {
  return address.addressLine2 !== undefined && address.addressLine2 !== ""
    ? `${address.addressLine1}\n${address.addressLine2}\n${
        address.city
      }\n${stateShorthand(address.state)} ${address.zipcode}`
    : `${address.addressLine1}\n${address.city}\n${stateShorthand(
        address.state
      )} ${address.zipcode}`
}

// Simplified and no edge cases considered.
export const stateShorthand = (stateString: string): string => {
  const strippedState: string = stateString.toLowerCase().replace(/\s/g, "")
  return strippedState in STATES ? STATES[strippedState] : stateString
}

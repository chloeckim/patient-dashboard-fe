import { PlaceOutlined } from "@mui/icons-material"
import { AddressType } from "../util/address"
import { Typography } from "@mui/material"

type PropsType = {
  addressList: AddressType[]
}

export default function AddressCell({ addressList }: PropsType) {
  console.log(addressList)
  if (addressList.length === 0) {
    return <></>
  }
  return (
    <>
      <PlaceOutlined />
      <p>{addressList[0].city}</p>
    </>
  )
}

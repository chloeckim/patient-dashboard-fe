import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { AddressType, DocType } from "../interfaces"
import { stringifyAddress } from "../util/address"
import React, { useEffect, useState } from "react"

type PropsType = {
  address: AddressType
  index: number
  handleAddressEdit: (eiditing: boolean, index: number) => void
  docObj: DocType
  setDocObj: React.Dispatch<React.SetStateAction<DocType>>
  validating: boolean
}

export function AddressCard({
  address,
  index,
  handleAddressEdit,
  docObj,
  setDocObj,
  validating,
}: PropsType) {
  const [newAddress, setNewAddress] = useState<AddressType>(address)
  const [addressValidating, setAddressValidating] = useState<boolean>(false)
  const validatingTotal: boolean = validating || addressValidating
  const validated: boolean =
    docObj.addresses[index].addressLine1 !== "" &&
    docObj.addresses[index].city !== "" &&
    docObj.addresses[index].state !== "" &&
    docObj.addresses[index].zipcode !== ""

  useEffect(() => {
    setNewAddress(address)
  }, [address])

  const handleDoneEdit = () => {
    setAddressValidating(true)
    if (!validated) return
    handleAddressEdit(false, index)
    setAddressValidating(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setDocObj({
      ...docObj,
      addresses: docObj.addresses.map((address: AddressType, index_: number) =>
        index === index_
          ? {
              ...address,
              [name]: value,
            }
          : address
      ),
    })
  }

  const handleDeleteAddress = () => {
    setDocObj({
      ...docObj,
      addresses: docObj.addresses?.filter(
        (value: AddressType, index_: number) => index !== index_
      ),
    })
  }

  return (
    <Card variant="outlined" sx={{ boxShadow: 3 }}>
      <CardContent>
        {address.editing ? (
          <Stack direction="column" gap={2} marginTop={1}>
            {index === 0 && (
              <div className="mb-4">
                <Chip
                  label={
                    <Typography variant="button" fontWeight="bold">
                      Primary
                    </Typography>
                  }
                  color="primary"
                  variant="outlined"
                  size="small"
                ></Chip>
              </div>
            )}
            <TextField
              required
              error={validatingTotal && newAddress.addressLine1 === ""}
              helperText={
                validatingTotal && newAddress.addressLine1 === "" && "Required"
              }
              name="addressLine1"
              label="Address Line 1"
              value={newAddress.addressLine1}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              name="addressLine2"
              label="Address Line 2"
              value={newAddress.addressLine2}
              onChange={handleInputChange}
              size="small"
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  required
                  error={validatingTotal && newAddress.city === ""}
                  helperText={
                    validatingTotal && newAddress.city === "" && "Required"
                  }
                  name="city"
                  label="City"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  required
                  error={validatingTotal && newAddress.state === ""}
                  helperText={
                    validatingTotal && newAddress.state === "" && "Required"
                  }
                  name="state"
                  label="State"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  required
                  error={validatingTotal && newAddress.zipcode === ""}
                  helperText={
                    validatingTotal && newAddress.zipcode === "" && "Required"
                  }
                  name="zipcode"
                  label="Zipcode"
                  value={newAddress.zipcode}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Edit action buttons  */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              gap={2}
              marginTop={1}
            >
              {index > 0 && (
                <Button
                  color="error"
                  size="small"
                  onClick={handleDeleteAddress}
                >
                  Remove address
                </Button>
              )}
              <Button size="small" onClick={handleDoneEdit}>
                Done
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <div>
              {index === 0 && (
                <div className="mb-4">
                  <Chip
                    label={
                      <Typography variant="button" fontWeight="bold">
                        Primary
                      </Typography>
                    }
                    color="primary"
                    variant="outlined"
                    size="small"
                  ></Chip>
                </div>
              )}
              <Typography
                whiteSpace="break-spaces"
                marginLeft={1}
                marginTop={1}
                fontWeight="medium"
                lineHeight="1.6rem"
              >
                {stringifyAddress(address)}
              </Typography>
            </div>
            <Button onClick={() => handleAddressEdit(true, index)}>Edit</Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

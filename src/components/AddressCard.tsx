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
import { AddressType } from "../interfaces"
import { stringifyAddress } from "../util/address"
import React, { useEffect, useState } from "react"

type PropsType = {
  address: AddressType
  index: number
  handleAddressEdit: (eiditing: boolean, index: number) => void
  setAddress: (newAddress: AddressType | null, index: number) => void
}

export function AddressCard({
  address,
  index,
  handleAddressEdit,
  setAddress,
}: PropsType) {
  const [newAddress, setNewAddress] = useState<AddressType>(address)

  useEffect(() => {
    setNewAddress(address)
  }, [address])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewAddress({ ...newAddress, [name]: value })
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
                  onClick={() => setAddress(null, index)}
                >
                  Remove address
                </Button>
              )}
              <Button
                size="small"
                onClick={() => {
                  handleAddressEdit(false, index)
                  setNewAddress(address)
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setAddress(newAddress, index)
                }}
              >
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

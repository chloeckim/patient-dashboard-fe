import { User } from "firebase/auth"
import {
  AddressType,
  ColType,
  ColWithValueType,
  DocType,
  INITIAL_ADDRESS,
  INITIAL_DOC,
  RowType,
  toDoc,
} from "../interfaces"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import { StatusChip } from "./StatusChip"
import { useEffect, useState } from "react"
import { AddOutlined } from "@mui/icons-material"
import { AddressCard } from "./AddressCard"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase"

type PropsType = {
  modalOpen: boolean
  closeModalFn: () => void
  row: RowType | null
  user: User
  customCols: ColType[]
}

export function EditModal({
  modalOpen,
  closeModalFn,
  row,
  user,
  customCols,
}: PropsType) {
  const [docObj, setDocObj] = useState<DocType>(INITIAL_DOC)
  const [dob, setDob] = useState<Dayjs | null>(null)
  const [optionalCols, setOptionalCols] = useState<ColWithValueType[]>(
    customCols.map(
      (col: ColType): ColWithValueType => ({
        colDef: col,
      })
    )
  )

  useEffect(() => {
    if (row === null) {
      setDocObj(INITIAL_DOC)
      setDob(null)
    } else {
      setDocObj(toDoc(row))
      if (row.dob) {
        setDob(dayjs(row.dob.valueOf(), "x"))
      }
    }
  }, [row])

  useEffect(() => {
    setOptionalCols(
      customCols.map(
        (col: ColType): ColWithValueType => ({
          colDef: col,
        })
      )
    )
  }, [customCols, row])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target
    setDocObj({
      ...docObj,
      [name]: value,
    })
  }

  const handleSelectChange = (event: SelectChangeEvent): void => {
    const { name, value } = event.target
    setDocObj({
      ...docObj,
      [name]: value,
    })
  }

  const onModalClose = () => {
    closeModalFn()
    setDocObj(INITIAL_DOC)
  }

  const handleAddressEdit = (editing: boolean, index: number): void => {
    setDocObj({
      ...docObj,
      addresses: docObj.addresses.map((address: AddressType, index_: number) =>
        index === index_ ? { ...address, editing: editing } : address
      ),
    })
  }

  const setAddress = (newAddress: AddressType | null, index: number): void => {
    console.log(newAddress)
    if (newAddress === null) {
      setDocObj({
        ...docObj,
        addresses: docObj.addresses.filter(
          (value: AddressType, index_: number) => index !== index_
        ),
      })
    } else {
      setDocObj({
        ...docObj,
        addresses: docObj.addresses.map(
          (address: AddressType, index_: number): AddressType =>
            index === index_
              ? {
                  addressLine1: newAddress.addressLine1,
                  addressLine2: newAddress.addressLine2 || "",
                  city: newAddress.city,
                  state: newAddress.state,
                  zipcode: newAddress.zipcode,
                }
              : address
        ),
      })
    }
  }

  const addAddress = (): void => {
    setDocObj({
      ...docObj,
      addresses: [...docObj.addresses, INITIAL_ADDRESS],
    })
  }

  const handleSubmit = async () => {
    let combinedDocObj = { ...docObj }

    optionalCols.forEach((col: ColWithValueType) => {
      if (col.value !== undefined) {
        Object.defineProperty(combinedDocObj, col.colDef.key, {
          value:
            col.colDef.type === "number"
              ? Number(col.value)
              : String(col.value),
          configurable: true,
          enumerable: true,
          writable: true,
        })
      }
      console.log(combinedDocObj)
    })

    if (row === null) {
      await addDoc(collection(db, "patients"), combinedDocObj)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id)
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      await setDoc(doc(db, "patients", row.id), combinedDocObj)
        .then(() => {
          console.log("Document written with ID: ", row.id)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleOptionalFieldChange = (key: string, value: string | number) => {
    setOptionalCols(
      optionalCols.map(
        (col: ColWithValueType): ColWithValueType =>
          col.colDef.key === key ? { ...col, value: value } : col
      )
    )
  }

  return (
    <Dialog open={modalOpen} onClose={onModalClose} maxWidth="lg" fullWidth>
      {row === null ? (
        <DialogTitle>Add a patient</DialogTitle>
      ) : (
        <DialogTitle>Edit patient info</DialogTitle>
      )}
      <DialogContent>
        <Grid container paddingTop={2} spacing={2} rowSpacing={3}>
          <Grid item xs={3}>
            <Typography fontWeight="bold">Required fields</Typography>
          </Grid>
          <Grid item xs={9}>
            <Stack direction="column" gap={3}>
              {/* Name stack */}
              <Stack direction="column" gap={1}>
                <Typography fontWeight="bold">Name</Typography>
                <Stack direction="row" gap={1}>
                  <TextField
                    required
                    name="firstName"
                    label="First Name"
                    value={docObj.firstName}
                    onChange={handleInputChange}
                    size="small"
                    className="grow"
                  />
                  <TextField
                    name="middleName"
                    label="Middle Name"
                    value={docObj.middleName}
                    onChange={handleInputChange}
                    size="small"
                    className="grow-0 min-w-fit"
                  />
                  <TextField
                    required
                    name="lastName"
                    label="Last Name"
                    value={docObj.lastName}
                    onChange={handleInputChange}
                    size="small"
                    className="grow"
                  />
                </Stack>
              </Stack>

              <Grid container spacing={3}>
                {/* DoB stack  */}
                <Grid item xs={6}>
                  <Stack direction="column" gap={1}>
                    <Typography fontWeight="bold">Date of Birth</Typography>
                    <DatePicker
                      value={dob}
                      onChange={(date) => setDob(date)}
                      maxDate={dayjs()}
                    />
                  </Stack>
                </Grid>
                {/* Status stack  */}
                <Grid item xs={6}>
                  <Stack direction="column" gap={1}>
                    <Typography fontWeight="bold">Status</Typography>
                    <Select
                      label="status"
                      name="status"
                      value={docObj.status}
                      onChange={handleSelectChange}
                      size="small"
                    >
                      <MenuItem value="Inquiry" divider selected>
                        <StatusChip status="Inquiry" />
                      </MenuItem>
                      <MenuItem value="Onboarding" divider>
                        <StatusChip status="Onboarding" />
                      </MenuItem>
                      <MenuItem value="Active" divider>
                        <StatusChip status="Active" />
                      </MenuItem>
                      <MenuItem value="Churned">
                        <StatusChip status="Churned" />
                      </MenuItem>
                    </Select>
                  </Stack>
                </Grid>
              </Grid>

              {/* Address stack  */}
              <Stack direction="column" gap={1}>
                <Typography fontWeight="bold">
                  {docObj.addresses.length > 1 ? "Addresses" : "Address"}
                </Typography>
                <Grid container spacing={2}>
                  {docObj.addresses.map(
                    (address: AddressType, index: number) => (
                      <Grid item xs={12} key={`address-card-${index}`}>
                        <AddressCard
                          address={address}
                          index={index}
                          handleAddressEdit={handleAddressEdit}
                          setAddress={setAddress}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
                <Button
                  startIcon={<AddOutlined />}
                  className=" self-start"
                  onClick={addAddress}
                >
                  Add address
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Custom (Optional) fields section  */}
          {optionalCols.length > 0 && (
            <Grid item xs={3}>
              <Typography fontWeight="bold">Optional fields</Typography>
            </Grid>
          )}
          <Grid item xs={9}>
            <Stack direction="column" gap={3}>
              {optionalCols.map((col: ColWithValueType) => (
                <Stack direction="column" gap={1}>
                  <Typography fontWeight="bold">{col.colDef.name}</Typography>
                  <TextField
                    type={col.colDef.type === "number" ? "number" : "text"}
                    name={col.colDef.key}
                    key={`text-input-${col.colDef.key}`}
                    label={col.colDef.name}
                    value={col.value}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleOptionalFieldChange(
                        col.colDef.key,
                        event.target.value
                      )
                    }}
                  ></TextField>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Action buttons stack  */}
        <Stack direction="row" justifyContent="flex-end" gap={2} marginTop={4}>
          <Button size="large" onClick={onModalClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              handleSubmit()
              onModalClose()
            }}
          >
            Submit
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

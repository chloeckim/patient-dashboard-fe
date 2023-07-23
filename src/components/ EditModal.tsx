import { User } from "firebase/auth"
import {
  AddressType,
  ColType,
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
    if (newAddress === null) {
      // Remove address.
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
          (address: AddressType, index_: number) =>
            index === index_ ? { ...newAddress, editing: undefined } : address
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
    if (row === null) {
      // Create a new doc
      await addDoc(collection(db, "patients"), docObj)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id)
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      // Overwrite a doc
      await setDoc(doc(db, "patients", row.id), docObj)
        .then(() => {
          console.log("Document written with ID: ", row.id)
        })
        .catch((error) => {
          console.error(error)
        })
    }
    console.log(docObj)
  }

  return (
    <Dialog open={modalOpen} onClose={onModalClose} maxWidth="md" fullWidth>
      {row === null ? (
        <DialogTitle>Add a patient</DialogTitle>
      ) : (
        <DialogTitle>Edit patient info</DialogTitle>
      )}
      <DialogContent>
        <Stack direction="column" gap={3} marginTop={1}>
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
              {docObj.addresses.map((address: AddressType, index: number) => (
                <Grid item xs={12} key={`address-card-${index}`}>
                  <AddressCard
                    address={address}
                    index={index}
                    handleAddressEdit={handleAddressEdit}
                    setAddress={setAddress}
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              startIcon={<AddOutlined />}
              className=" self-start"
              onClick={addAddress}
            >
              Add address
            </Button>
          </Stack>

          {/* Action buttons stack  */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            gap={2}
            marginTop={1}
          >
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
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

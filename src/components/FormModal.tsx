import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import { Timestamp, addDoc, collection } from "firebase/firestore"
import { db } from "../config/firebase"
import { User } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { AddOutlined } from "@mui/icons-material"
import { ColType } from "./Dashboard"

type PropsType = {
  modalOpen: boolean
  handleClose: () => void
  user: User
  customCols: ColType[]
}

type CustomFieldType = {
  key: string
  name: string
  type: string
  value: string
}

// Refactoring idea from https://dev.to/deboragaleano/how-to-handle-multiple-inputs-in-react-55el
const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  status: "",
}

const initialAddress = {
  street: "",
  street2: "",
  city: "",
  state: "",
  zipcode: "",
}

export default function FormModal({
  modalOpen,
  handleClose,
  user,
  customCols,
}: PropsType) {
  const [values, setValues] = useState(initialValues)
  const [dob, setDob] = useState<Dayjs | null>()
  const [addressList, setAddressList] = useState([initialAddress])

  const [customFields, setCustomFields] = useState<CustomFieldType[]>(
    customCols.map((col) => ({
      ...col,
      value: "",
    }))
  )

  useEffect(() => {
    setCustomFields(
      customCols.map((col) => ({
        ...col,
        value: "",
      }))
    )
  }, [customCols])

  const resetInputs = () => {
    setValues(initialValues)
    setDob(null)
    setAddressList([initialAddress])
    setCustomFields(
      customCols.map((col) => ({
        ...col,
        value: "",
      }))
    )
  }

  const validateData = (): boolean => {
    let validated: boolean =
      values.firstName !== "" &&
      values.lastName !== "" &&
      values.status !== "" &&
      dob !== null &&
      dob?.toDate() !== undefined &&
      addressList.length > 0

    addressList.forEach((address) => {
      validated =
        validated &&
        address.street !== "" &&
        address.city !== "" &&
        address.state !== "" &&
        address.zipcode !== ""
    })
    return validated
  }

  const handleSubmit = async () => {
    if (!validateData()) {
      // Input invalid.
      return
    }
    let dobDate = dob?.toDate() || new Date()
    let dataObject = {
      uid: user.uid,
      ...values,
      dob: Timestamp.fromDate(dobDate),
      addresses: addressList,
    }

    await addDoc(collection(db, "patients"), dataObject)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value

    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    console.log(values)
    console.log(dob)
    setValues({
      ...values,
      status: event.target.value,
    })
  }

  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index_: number
  ) => {
    const name = event.target.name
    const value = event.target.value

    setAddressList((prevList) =>
      prevList.map((address, index) => {
        if (index === index_) {
          return {
            ...address,
            [name]: value,
          }
        } else {
          return address
        }
      })
    )
  }

  const handleAddAddress = () => {
    setAddressList((prevList) => [...prevList, initialAddress])
  }

  const handleCustomFieldChange = (key: string, value: string) => {
    setCustomFields((prevFields) =>
      prevFields.map((field) => {
        if (field.key === key) {
          return {
            ...field,
            value: value,
          }
        } else {
          return field
        }
      })
    )
    console.log("handleCustomFieldChange", customFields)
  }

  return (
    <Dialog
      open={modalOpen}
      onClose={() => {
        handleClose()
        resetInputs()
      }}
    >
      <DialogTitle>Add a new patient</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3 mt-4">
          <DialogContentText>Required fields</DialogContentText>
          <div className="flex flex-row gap-2">
            <TextField
              required
              name="firstName"
              label="First Name"
              value={values.firstName}
              onChange={handleInputChange}
            />
            <TextField
              name="middleName"
              label="Middle Name"
              onChange={handleInputChange}
              value={values.middleName}
            />
            <TextField
              required
              name="lastName"
              label="Last Name"
              onChange={handleInputChange}
              value={values.lastName}
            />
          </div>
          <div>
            <DatePicker
              label="Date of Birth *"
              maxDate={dayjs()}
              value={dob}
              onChange={(date) => setDob(date)}
            />
          </div>
          <div>
            <InputLabel id="status-label">Status *</InputLabel>
            <Select
              labelId="status-label"
              value={values.status}
              onChange={handleStatusChange}
              label="Status"
              fullWidth
            >
              <MenuItem value="Inquiry">Inquiry</MenuItem>
              <MenuItem value="Onboarding">Onboarding</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Churned">Churned</MenuItem>
            </Select>
          </div>
          <div className="flex flex-col">
            {addressList.map((address, index) => (
              <div
                key={`address-form-${index}`}
                className="flex flex-col gap-3 mb-8"
              >
                <InputLabel>Address {index + 1} *</InputLabel>
                <TextField
                  required
                  name="street"
                  label="Street Address"
                  value={address.street}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleAddressChange(event, index)
                  }}
                />
                <TextField
                  name="street2"
                  label="Street Address 2"
                  value={address.street2}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleAddressChange(event, index)
                  }}
                />
                <div className="flex flex-row gap-2 w-full">
                  <TextField
                    required
                    name="city"
                    label="City"
                    value={address.city}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleAddressChange(event, index)
                    }}
                  />
                  <TextField
                    required
                    name="state"
                    label="State"
                    value={address.state}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleAddressChange(event, index)
                    }}
                  />
                  <TextField
                    required
                    name="zipcode"
                    label="Zipcode"
                    value={address.zipcode}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleAddressChange(event, index)
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-3">
              <DialogContentText>Custom fields (optional)</DialogContentText>
              {customFields.map((col) => (
                <TextField
                  type={col.type === "number" ? "number" : "text"}
                  name={col.key}
                  label={col.name}
                  value={col.type === "number" ? Number(col.value) : col.value}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleCustomFieldChange(col.key, event.target.value)
                  }}
                ></TextField>
              ))}
            </div>
            <Button
              className="self-end"
              startIcon={<AddOutlined />}
              onClick={handleAddAddress}
            >
              Add another address
            </Button>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            resetInputs()
            handleClose()
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleSubmit()
            resetInputs()
            handleClose()
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

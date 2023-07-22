import { User } from "firebase/auth"
import { ColType, DocType } from "../interfaces"
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
import { useState } from "react"
import { AddOutlined } from "@mui/icons-material"

type PropsType = {
  modalOpen: boolean
  closeModalFn: () => void
  actionType: string
  user: User
  initialDoc: DocType
  customCols: ColType[]
}

export function EditModal({
  modalOpen,
  closeModalFn,
  actionType,
  user,
  initialDoc,
  customCols,
}: PropsType) {
  const [doc, setDoc] = useState<DocType>(initialDoc)
  const [dob, setDob] = useState<Dayjs | null>(null)

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target
    setDoc({
      ...doc,
      [name]: value,
    })
  }

  const handleSelectChange = (event: SelectChangeEvent): void => {
    const { name, value } = event.target
    console.log(name, value)
    setDoc({
      ...doc,
      [name]: value,
    })
  }

  const onModalClose = () => {
    closeModalFn()
    setDoc(initialDoc)
  }

  return (
    <Dialog open={modalOpen} onClose={onModalClose} fullWidth>
      {actionType === "create" ? (
        <DialogTitle>Add a new patient</DialogTitle>
      ) : (
        <DialogTitle>Edit patient info</DialogTitle>
      )}
      <DialogContent>
        <Stack direction="column" gap={3} marginTop={1}>
          {/* Name stack */}
          <Stack direction="column" gap={1}>
            <Typography fontWeight="bold">Patient Name</Typography>
            <Stack direction="row" gap={1}>
              <TextField
                required
                name="firstName"
                label="First Name"
                value={doc.firstName}
                onChange={handleInputChange}
                size="small"
                className="grow"
              />
              <TextField
                name="middleName"
                label="Middle Name"
                value={doc.middleName}
                onChange={handleInputChange}
                size="small"
                className="grow-0 min-w-fit"
              />
              <TextField
                required
                name="lastName"
                label="Last Name"
                value={doc.lastName}
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
                  value={doc.status}
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
            <Typography fontWeight="bold">Address</Typography>
            <Button
              startIcon={<AddOutlined />}
              size="small"
              className=" self-start"
            >
              Add address
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { User } from "firebase/auth"
import { AddOutlined, RemoveCircle } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { ColType } from "../interfaces"

type PropsType = {
  modalOpen: boolean
  closeModalFn: () => void
  user: User
  customCols: ColType[]
}

export default function ColumnModal({
  modalOpen,
  closeModalFn,
  user,
  customCols,
}: PropsType) {
  const [manageCols, setManageCols] = useState<ColType[]>([...customCols])

  const resetCols = () => {
    setManageCols([...customCols])
  }

  useEffect(() => {
    resetCols()
  }, [customCols])

  const handleAddCol = () => {
    setManageCols([
      ...manageCols,
      {
        key: "",
        name: "",
        type: "string",
      },
    ])
  }

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value
    setManageCols(
      manageCols.map((col: ColType, index_: number) =>
        index === index_
          ? {
              ...col,
              name: value,
              key: value.replace(/\s/g, ""),
            }
          : col
      )
    )
  }

  const handleTypeChange = (event: SelectChangeEvent, index: number) => {
    const value = event.target.value
    setManageCols(
      manageCols.map((col: ColType, index_: number) =>
        index === index_
          ? {
              ...col,
              type: value,
            }
          : col
      )
    )
  }

  const handleDeleteCol = (index: number) => {
    setManageCols(
      manageCols.filter((col: ColType, index_: number) => {
        return index !== index_
      })
    )
  }

  const handleSubmit = async () => {
    // TODO: validate data
    await setDoc(doc(db, "columns", user.uid), { columns: manageCols })
      .then(() => {
        console.log("Columns updated!")
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Dialog open={modalOpen} onClose={closeModalFn} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" gutterBottom>
          Manage custom fields
        </Typography>
        <Typography variant="subtitle2">
          Custom fields are additional text or number fields that can be
          arbitrarily created. All custom fields are optional.
        </Typography>
        <Typography variant="subtitle2" fontWeight="bold">
          *** Limitation: deleting a custom field does not delete the field
          values in data.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div className="mt-8">
          <Grid container spacing={1} rowSpacing={4}>
            {manageCols.map((column: ColType, index: number) => (
              <>
                <Grid item xs={3}>
                  <Stack direction="row" gap={1} alignItems="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteCol(index)}
                    >
                      <RemoveCircle fontSize="inherit" />
                    </IconButton>
                    <Typography fontWeight="bold">
                      Custom field {index + 1}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={5}>
                  <Stack direction="column" gap={1}>
                    <Typography fontWeight="bold">Name</Typography>
                    <TextField
                      value={column.name}
                      size="small"
                      fullWidth
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        handleNameChange(event, index)
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  <Stack direction="column" gap={1}>
                    <Typography fontWeight="bold">Type</Typography>
                    <FormControl fullWidth>
                      <Select
                        label="Field type"
                        value={column.type}
                        size="small"
                        onChange={(event: SelectChangeEvent) =>
                          handleTypeChange(event, index)
                        }
                      >
                        <MenuItem value="string">text</MenuItem>
                        <MenuItem value="number">number</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<AddOutlined />} onClick={handleAddCol}>
                Add field
              </Button>
            </Grid>
          </Grid>

          {/* Action buttons stack  */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            gap={2}
            marginTop={2}
          >
            <Button
              size="large"
              onClick={() => {
                closeModalFn()
                resetCols()
              }}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                // Send back to the backend first
                handleSubmit()
                closeModalFn()
                resetCols()
              }}
            >
              Update Fields
            </Button>
          </Stack>
        </div>
      </DialogContent>
    </Dialog>
  )
}

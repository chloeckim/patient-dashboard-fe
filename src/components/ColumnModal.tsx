import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { User } from "firebase/auth"
import { AddOutlined, Check, Delete, Edit } from "@mui/icons-material"
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

type EditableColType = {
  allowEdit: boolean
  key: string
  name: string
  type: string
}

export default function ColumnModal({
  modalOpen,
  closeModalFn,
  user,
  customCols,
}: PropsType) {
  const [editableCols, setEditableCols] = useState<EditableColType[]>(
    customCols.map((col) => ({ ...col, allowEdit: false }))
  )

  useEffect(() => {
    resetCols()
  }, [customCols])

  const handleAllowEdit = (index: number, allow: boolean) => {
    setEditableCols((prevCols) =>
      prevCols.map((col, index_) => {
        if (index === index_) {
          return {
            ...col,
            allowEdit: allow,
          }
        } else {
          return col
        }
      })
    )
  }

  // When name changed, also update the key.
  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value
    setEditableCols((prevCols) =>
      prevCols.map((col, index_) => {
        if (index === index_) {
          return {
            ...col,
            name: value,
            key: value.replace(/\s/g, ""),
          }
        } else {
          return col
        }
      })
    )
  }

  const handleTypeChange = (event: SelectChangeEvent, index: number) => {
    const value = event.target.value
    setEditableCols((prevCols) =>
      prevCols.map((col, index_) => {
        if (index === index_) {
          return {
            ...col,
            type: value,
          }
        } else {
          return col
        }
      })
    )
  }

  const handleDelete = (index: number) => {
    setEditableCols((prevCols) =>
      prevCols.filter((col, index_) => {
        return index !== index_
      })
    )
  }

  const handleAdd = () => {
    setEditableCols((prevCols) => [
      ...prevCols,
      {
        allowEdit: true,
        key: "",
        name: "",
        type: "",
      },
    ])
  }

  const resetCols = () => {
    setEditableCols(customCols.map((col) => ({ ...col, allowEdit: false })))
  }

  const handleSubmit = async () => {
    // TODO: validate data
    const dataObject = {
      columns: editableCols.map((col) => ({
        name: col.name,
        key: col.key,
        type: col.type,
      })),
    }

    await setDoc(doc(db, "columns", user.uid), dataObject)
      .then(() => {
        console.log("Columns updated!")
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Dialog open={modalOpen} onClose={closeModalFn}>
      <DialogTitle>Manage custom columns</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 mt-6">
          {editableCols.map((column: EditableColType, index: number) => (
            <div key={`custom-col-${index}`} className="flex flex-row gap-2">
              <TextField
                disabled={!column.allowEdit}
                label="Name"
                value={column.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleNameChange(event, index)
                }}
              />
              <div>
                <Select
                  value={column.type}
                  label="Type"
                  className="w-48"
                  disabled={!column.allowEdit}
                  onChange={(event: SelectChangeEvent) =>
                    handleTypeChange(event, index)
                  }
                >
                  <MenuItem value="string">string</MenuItem>
                  <MenuItem value="number">number</MenuItem>
                </Select>
              </div>
              <div className="flex flex-row w-24 justify-end">
                {!column.allowEdit && (
                  <IconButton
                    onClick={() => {
                      handleAllowEdit(index, true)
                    }}
                  >
                    <Edit />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => {
                    handleDelete(index)
                  }}
                >
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))}
          <Button
            className="self-end"
            startIcon={<AddOutlined />}
            onClick={handleAdd}
          >
            Add a new column
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            closeModalFn()
            resetCols()
          }}
        >
          Discard Changes
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            // Send back to the backend first
            handleSubmit()
            closeModalFn()
            resetCols()
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

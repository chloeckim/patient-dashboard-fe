import { AddOutlined, Settings, PlaylistAdd } from "@mui/icons-material"
import { Stack, Button } from "@mui/material"
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid"
import { populateSampleData } from "../util/sample-data-generator"
import { User } from "firebase/auth"
import { COLUMN_MODAL_NAME, EDIT_MODAL_NAME } from "../interfaces"

type PropsType = {
  openModal: (thisModalName: string) => void
  user: User
}

export function TableToolbar({ openModal, user }: PropsType) {
  return (
    <div className="bg-sky-50 p-4">
      <GridToolbarContainer className="flex flex-row justify-between">
        <Stack direction="row" spacing={2}>
          <GridToolbarQuickFilter />
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
        </Stack>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            startIcon={<AddOutlined />}
            onClick={() => openModal(EDIT_MODAL_NAME)}
          >
            Add Patient
          </Button>
          <Button
            startIcon={<PlaylistAdd />}
            onClick={() => populateSampleData(user)}
          >
            Sample Data
          </Button>
          <Button
            startIcon={<Settings />}
            onClick={() => openModal(COLUMN_MODAL_NAME)}
          >
            Custom Fields
          </Button>
        </Stack>
      </GridToolbarContainer>
    </div>
  )
}

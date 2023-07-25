import { AddOutlined, Settings, PlaylistAdd } from "@mui/icons-material"
import { Stack, Button, Popover, Typography } from "@mui/material"
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid"
import { populateSampleData } from "../util/sample-data-generator"
import { User } from "firebase/auth"
import { COLUMN_MODAL_NAME, EDIT_MODAL_NAME } from "../interfaces"
import { useState } from "react"

type PropsType = {
  openModal: (thisModalName: string) => void
  user: User
}

export function TableToolbar({ openModal, user }: PropsType) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const popoverOpen = Boolean(anchorEl)

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
            aria-owns={popoverOpen ? `sample-data-popover` : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
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
      <Popover
        id="sample-data-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="body2" fontWeight="medium" margin={1}>
          Autogenerates 10 sample patient data.
        </Typography>
      </Popover>
    </div>
  )
}

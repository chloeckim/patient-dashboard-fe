import { SpeakerNotes } from "@mui/icons-material"
import { Box, Grid, IconButton, Popover, Typography } from "@mui/material"
import { GridRowId } from "@mui/x-data-grid"
import { useState } from "react"

type PropsType = {
  customFields: Record<string, string | number>
  rowId: GridRowId
}

export default function CustomFieldsCell({ customFields, rowId }: PropsType) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const popoverOpen = Boolean(anchorEl)
  const keys = Object.keys(customFields)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <div
        aria-owns={popoverOpen ? `custom-fields-popover-${rowId}` : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <IconButton color="primary" size="medium">
          <SpeakerNotes fontSize="inherit" />
        </IconButton>
      </div>
      <Popover
        id={`custom-fields-popover-${rowId}`}
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
        <Box>
          <Grid
            container
            paddingX={3}
            paddingY={3}
            columnSpacing={2}
            rowSpacing={1}
            maxWidth="sm"
          >
            {keys.map((key: string) => (
              <>
                <Grid item xs={5}>
                  <Typography
                    whiteSpace="break-spaces"
                    variant="body2"
                    fontWeight="medium"
                    lineHeight="1.4rem"
                  >
                    {key}:
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    whiteSpace="break-spaces"
                    variant="body2"
                    lineHeight="1.4rem"
                  >
                    {customFields[key]}
                  </Typography>
                </Grid>
              </>
            ))}
          </Grid>
        </Box>
      </Popover>
    </>
  )
}

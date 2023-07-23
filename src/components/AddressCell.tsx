import { FmdGood } from "@mui/icons-material"
import { stateShorthand, stringifyAddress } from "../util/address"
import { Chip, IconButton, Popover, Stack, Typography } from "@mui/material"
import { GridRowId } from "@mui/x-data-grid"
import { useState } from "react"
import { AddressType } from "../interfaces"

type PropsType = {
  addressList: AddressType[]
  rowId: GridRowId
}

export default function AddressCell({ addressList, rowId }: PropsType) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const popoverOpen = Boolean(anchorEl)

  if (addressList.length === 0) {
    return <></>
  }
  return (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <div
          aria-owns={popoverOpen ? `address-popover-${rowId}` : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <IconButton color="primary" size="small">
            <FmdGood fontSize="inherit" />
          </IconButton>
        </div>
        <Stack>
          <Typography variant="body2" fontWeight="medium">
            {addressList[0].city}
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {stateShorthand(addressList[0].state)}{" "}
            {addressList[0].zipcode.slice(0, 5)}
          </Typography>
        </Stack>
      </Stack>
      <Popover
        id={`address-popover-${rowId}`}
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
        <Stack direction="column" paddingX={3} paddingY={3} spacing={2}>
          {addressList.map((address: AddressType, index: number) => (
            <div>
              {index === 0 && (
                <Chip
                  label={
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      fontSize="0.7rem"
                    >
                      PRIMARY
                    </Typography>
                  }
                  color="primary"
                  variant="outlined"
                  size="small"
                ></Chip>
              )}
              <Typography
                whiteSpace="break-spaces"
                variant="body2"
                fontWeight="medium"
                lineHeight="1.4rem"
                marginTop={1}
                marginX={0.5}
              >
                {stringifyAddress(address)}
              </Typography>
            </div>
          ))}
        </Stack>
      </Popover>
    </>
  )
}

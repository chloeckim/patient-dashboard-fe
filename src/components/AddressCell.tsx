import { FmdGood } from "@mui/icons-material"
import { stateShorthand, stringifyAddress } from "../util/address"
import { IconButton, Popover, Stack, Typography } from "@mui/material"
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
    <div>
      <Stack direction="row" alignItems="center" gap={1}>
        <div
          aria-owns={popoverOpen ? `address-popover-${rowId}` : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          {/* <Badge badgeContent={addressList.length} color="default"> */}
          <IconButton color="primary" size="small">
            <FmdGood fontSize="inherit" />
          </IconButton>
          {/* </Badge> */}
        </div>
        <Stack>
          <Typography variant="body2">{addressList[0].city}</Typography>
          <Typography variant="body2">
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
        <div className="flex flex-col px-4 py-3 gap-4">
          {addressList.map((address: AddressType, index: number) => (
            <Typography
              whiteSpace="break-spaces"
              variant="body2"
              lineHeight="1.5rem"
            >
              {stringifyAddress(address)}
            </Typography>
          ))}
          {/* <Typography
            whiteSpace="break-spaces"
            variant="body2"
            lineHeight="1.5rem"
          >
            {stringifyAddress(addressList[0])}
          </Typography> */}
        </div>
      </Popover>
    </div>
  )
}

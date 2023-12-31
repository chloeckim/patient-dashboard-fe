import { Chip, Typography } from "@mui/material"

type PropsType = {
  status: string
}

export function StatusChip({ status }: PropsType) {
  const statusBadgeColors: Record<
    string,
    | "secondary"
    | "primary"
    | "success"
    | "error"
    | "default"
    | "info"
    | "warning"
  > = {
    Inquiry: "secondary",
    Onboarding: "primary",
    Active: "success",
    Churned: "error",
  }
  return (
    <Chip
      label={
        <Typography variant="button" fontWeight="medium">
          {status}
        </Typography>
      }
      color={statusBadgeColors[status]}
    />
  )
}

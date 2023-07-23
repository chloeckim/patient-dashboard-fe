import { User } from "firebase/auth"
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  SelectChangeEvent,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { db } from "../config/firebase"
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid"
import { Edit, ListAlt, MoreVert } from "@mui/icons-material"
import ColumnModal from "./ColumnModal"
import { formatDateToString } from "../util/date"
import AddressCell from "./AddressCell"
import { StatusChip } from "./StatusChip"
import {
  AddressType,
  COLUMN_MODAL_NAME,
  ColType,
  EDIT_MODAL_NAME,
  RowType,
  TableWidthType,
} from "../interfaces"
import { EditModal } from "./ EditModal"
import { TableToolbar } from "./TableToolbar"

type PropsType = {
  user: User
}

export default function Dashboard({ user }: PropsType) {
  const [loading, setLoading] = useState<boolean>(true)
  const [modalName, setModalName] = useState<string>("")
  const [editRow, setEditRow] = useState<RowType | null>(null)
  const [customCols, setCustomCols] = useState<ColType[]>([])
  const [rows, setRows] = useState<RowType[]>([])
  const [tableWidth, setTableWidth] = useState<TableWidthType>("lg")

  useEffect(() => {
    const q = query(collection(db, "patients"), where("uid", "==", user.uid))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setRows(
        querySnapshot.docs.map(
          (doc): RowType => ({
            ...doc.data(),
            dob: doc.data().dob?.toDate(),
            id: doc.id,
          })
        )
      )
      setLoading(false)
    })
    const unsubscribeCols = onSnapshot(doc(db, "columns", user.uid), (doc) => {
      const newAdditionalCols: ColType[] = [...doc.data()?.columns]
      setCustomCols(newAdditionalCols)
    })
    return () => {
      unsubscribe()
      unsubscribeCols()
    }
  }, [])

  const openModal = (thisModalName: string) => {
    setModalName(thisModalName)
  }
  const closeModal = () => {
    setEditRow(null)
    setModalName("")
  }

  const handleOpenEdit = (row: RowType) => {
    setEditRow(row)
    openModal(EDIT_MODAL_NAME)
  }

  const handleTableWidtchChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value
    console.log(value)
    if (value == "sm" || value == "md" || value == "lg" || value == "xl") {
      setTableWidth(value)
    }
  }

  const CustomToolbar = () => {
    return (
      <TableToolbar
        openModal={openModal}
        user={user}
        tableWidth={tableWidth}
        handleTableWidtchChange={handleTableWidtchChange}
      />
    )
  }

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: "actions",
        type: "actions",
        getActions: (params) => [
          <GridActionsCellItem
            icon={<MoreVert />}
            label="Edit"
            onClick={() => {
              handleOpenEdit(params.row)
            }}
          />,
        ],
        align: "center",
        width: 30,
      },
      {
        field: "fullName",
        headerName: "Full Name",
        headerClassName: "app--table-header-class",
        valueGetter: (params) => {
          return `${params.row.firstName || ""} ${
            params.row.middleName || ""
          } ${params.row.lastName || ""}`
        },
        renderCell: (params: GridRenderCellParams) => (
          <Typography fontWeight="medium">{`${params.row.firstName || ""} ${
            params.row.middleName || ""
          } ${params.row.lastName || ""}`}</Typography>
        ),
        width: 200,
      },
      { field: "firstName", headerName: "First Name", width: 130 },
      { field: "middleName", headerName: "Middle Name", width: 130 },
      { field: "lastName", headerName: "Last Name", width: 130 },
      {
        field: "dob",
        headerName: "Date of Birth",
        type: "date",
        valueFormatter: (params: GridValueFormatterParams<Date>) => {
          if (params.value === null) {
            return ""
          }
          return `${formatDateToString(params.value)}`
        },
        width: 200,
      },
      {
        field: "status",
        headerName: "Status",
        renderCell: (params) => <StatusChip status={params.value} />,
        minWidth: 200,
        flex: 1,
      },
      {
        field: "addresses",
        headerName: "Address",
        renderCell: (params: GridRenderCellParams<AddressType[]>) => (
          <AddressCell addressList={params.value} rowId={params.id} />
        ),
        flex: 2,
        minWidth: 200,
      },
      {
        field: "customForm",
        headerName: "Form",
        renderCell: () => (
          <IconButton>
            <ListAlt />
          </IconButton>
        ),
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      ...customCols.map((column: ColType) => ({
        field: column.key,
        headerName: column.name,
        width: 130,
        type: column.type,
      })),
    ]
  }, [customCols])

  return loading ? (
    <div className="flex justify-center items-center mt-10">
      <CircularProgress />
    </div>
  ) : (
    <>
      <Container maxWidth={tableWidth} className="mt-10">
        <Box sx={{ height: 350, wdith: "100%" }}>
          <DataGrid
            sx={{
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
                outline: "none !important",
              },
            }}
            rows={rows}
            columns={columns}
            density="comfortable"
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
              columns: {
                ...columns,
                columnVisibilityModel: {
                  firstName: false,
                  middleName: false,
                  lastName: false,
                },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            slots={{ toolbar: CustomToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  debounceMs: 500,
                },
              },
            }}
            autoHeight
          ></DataGrid>
        </Box>
      </Container>
      <ColumnModal
        modalOpen={modalName === COLUMN_MODAL_NAME}
        closeModalFn={closeModal}
        user={user}
        customCols={customCols}
      />
      <EditModal
        modalOpen={modalName === EDIT_MODAL_NAME}
        closeModalFn={closeModal}
        row={editRow}
        user={user}
        customCols={customCols}
      />
    </>
  )
}

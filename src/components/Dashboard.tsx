import { User } from "firebase/auth"
import { Box, Button, CircularProgress, Container, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { db } from "../config/firebase"
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridValueFormatterParams,
} from "@mui/x-data-grid"
import { AddOutlined, Edit, PlaylistAdd, Settings } from "@mui/icons-material"
import ColumnModal from "./ColumnModal"
import { formatDateToString } from "../util/date"
import AddressCell from "./AddressCell"
import { StatusChip } from "./StatusChip"
import { AddressType, ColType, RowType } from "../interfaces"
import { EditModal } from "./ EditModal"
import { populateSampleData } from "../util/sample-data-generator"

type PropsType = {
  user: User
}

export default function Dashboard({ user }: PropsType) {
  const [loading, setLoading] = useState<boolean>(true)
  const [modalName, setModalName] = useState<string>("")
  const [editRow, setEditRow] = useState<RowType | null>(null)
  const [customCols, setCustomCols] = useState<ColType[]>([])
  const [rows, setRows] = useState<RowType[]>([])
  const editModalName = "edit-modal"
  const columnModalName = "column-modal"
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
    openModal(editModalName)
  }

  const CustomToolbar = () => {
    return (
      <div className="bg-sky-50 p-4">
        <GridToolbarContainer className="flex flex-row justify-between">
          <Stack direction="row" spacing={2}>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<AddOutlined />}
              onClick={() => openModal(editModalName)}
            >
              Add Patient
            </Button>
            <Button
              startIcon={<Settings />}
              onClick={() => openModal(columnModalName)}
            >
              Custom Columns
            </Button>
            <Button
              startIcon={<PlaylistAdd />}
              onClick={() => populateSampleData(user)}
            >
              Sample Data
            </Button>
          </Stack>
          <GridToolbarQuickFilter />
        </GridToolbarContainer>
      </div>
    )
  }

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: "fullName",
        headerName: "Full Name *",
        headerClassName: "app--table-header-class",
        // cellClassName
        valueGetter: (params) => {
          return `${params.row.firstName || ""} ${
            params.row.middleName || ""
          } ${params.row.lastName || ""}`
        },
        width: 150,
      },
      { field: "firstName", headerName: "First Name *", width: 130 },
      { field: "middleName", headerName: "Middle Name", width: 130 },
      { field: "lastName", headerName: "Last Name *", width: 130 },
      {
        field: "dob",
        headerName: "Date of Birth *",
        type: "date",
        valueFormatter: (params: GridValueFormatterParams<Date>) => {
          if (params.value === null) {
            return ""
          }
          return `${formatDateToString(params.value)}`
        },
        width: 130,
      },
      {
        field: "status",
        headerName: "Status *",
        renderCell: (params) => <StatusChip status={params.value} />,
        width: 140,
      },
      {
        field: "addresses",
        headerName: "Address *",
        renderCell: (params: GridRenderCellParams<AddressType[]>) => (
          <AddressCell addressList={params.value} rowId={params.id} />
        ),
        flex: 1,
      },
      ...customCols.map((column: ColType) => ({
        field: column.key,
        headerName: column.name,
        width: 130,
        type: column.type,
      })),
      {
        field: "actions",
        type: "actions",
        minWidth: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => {
              handleOpenEdit(params.row)
            }}
          />,
        ],
        align: "right",
        flex: 1,
      },
    ]
  }, [customCols])

  return loading ? (
    <div className="flex justify-center items-center mt-10">
      <CircularProgress />
    </div>
  ) : (
    <>
      <Container maxWidth="lg" className="mt-10">
        <Box sx={{ height: 350, wdith: "100%" }}>
          <DataGrid
            sx={{
              // boxShadow: 2,
              // border: 2,
              // borderColor: 'primary.light',
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
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
            // checkboxSelection
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
        modalOpen={modalName === columnModalName}
        closeModalFn={closeModal}
        user={user}
        customCols={customCols}
      />
      <EditModal
        modalOpen={modalName === editModalName}
        closeModalFn={closeModal}
        row={editRow}
        user={user}
        customCols={customCols}
      />
    </>
  )
}

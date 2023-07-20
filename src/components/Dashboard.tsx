import { User } from "firebase/auth"
import { Box, Button, CircularProgress, Container, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { db } from "../config/firebase"
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid"
import FormModal from "./FormModal"
import { Delete, Edit } from "@mui/icons-material"
import ColumnModal from "./ColumnModal"

type PropsType = {
  user: User
}

export type ColType = {
  key: string
  name: string
  type: string
}

export default function Dashboard({ user }: PropsType) {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [columnModalOpen, setColumnModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [customCols, setCustomCols] = useState<ColType[]>([])
  const [rows, setRows] = useState([{}])

  const columns = useMemo<GridColDef[]>(() => {
    return [
      {
        field: "fullName",
        headerName: "Full Name *",
        valueGetter: (params) => {
          return `${params.row.firstName || ""} ${
            params.row.middleName || ""
          } ${params.row.lastName || ""}`
        },
        width: 130,
      },
      { field: "firstName", headerName: "First Name *", width: 130 },
      { field: "middleName", headerName: "Middle Name", width: 130 },
      { field: "lastName", headerName: "Last Name *", width: 130 },
      { field: "dob", headerName: "Date of Birth *", type: "date", width: 130 },
      { field: "status", headerName: "Status *", width: 130 },
      { field: "address", headerName: "Address *", width: 130 },
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
            onClick={() => {}}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => {
              handleDeletePatient(params.row.id)
            }}
          />,
        ],
        align: "right",
        flex: 1,
      },
    ]
  }, [customCols])

  const handleClickOpen = () => {
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  const handleColumnModalOpen = () => {
    setColumnModalOpen(true)
  }

  const handleColumnModalClose = () => {
    setColumnModalOpen(false)
  }

  const handleDeletePatient = async (docId: string) => {
    // TODO: Maybe add an alert dialog since this is a final action.
    await deleteDoc(doc(db, "patients", docId))
      .then(() => {
        console.log("Deleted", docId)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    const q = query(collection(db, "patients"), where("uid", "==", user.uid))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const patients = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        dob: doc.data().dob?.toDate(),
        id: doc.id,
      }))
      setRows(patients)
      setLoading(false)
    })
    const unsubscribeCols = onSnapshot(doc(db, "columns", user.uid), (doc) => {
      console.log("Columns:", doc.data())
      const newAdditionalCols: ColType[] = [...doc.data()?.columns]
      setCustomCols(newAdditionalCols)
    })
    return () => {
      unsubscribe()
      unsubscribeCols()
    }
  }, [])

  return loading ? (
    <div className="flex justify-center items-center mt-10">
      <CircularProgress />
    </div>
  ) : (
    <>
      <FormModal
        modalOpen={modalOpen}
        handleClose={handleClose}
        user={user}
        customCols={customCols}
      />
      <ColumnModal
        modalOpen={columnModalOpen}
        handleClose={handleColumnModalClose}
        user={user}
        customCols={customCols}
      />
      <Container maxWidth="lg" className="mt-10">
        <div className="flex flex-row gap-4 justify-end mb-4">
          <Button onClick={handleClickOpen}>Add a new patient</Button>
          <Button onClick={handleColumnModalOpen}>Manage custom columns</Button>
        </div>
        <Box sx={{ height: 350, wdith: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
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
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
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
    </>
  )
}

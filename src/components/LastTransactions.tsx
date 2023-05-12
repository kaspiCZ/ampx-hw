import { useSetRecoilState } from "recoil"
import { deleteDoc, doc } from "firebase/firestore"
import {
  Chip,
  Unstable_Grid2 as Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"
import { Delete, Edit, InfoOutlined } from "@mui/icons-material"
import { format } from "date-fns"

import { db } from "../firebase"
import {
  aIncomeExpenseModalState,
  aIncomeExpenseModalOpen,
} from "../state/atoms/ui"
import useLastTransactions from "../hooks/last-transactions"

const LastTransactions = () => {
  const theme = useTheme()
  const transactions = useLastTransactions()
  const setModalState = useSetRecoilState(aIncomeExpenseModalState)
  const setModalOpen = useSetRecoilState(aIncomeExpenseModalOpen)

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={120}>Date</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell width={1}></TableCell>
            <TableCell width={1}></TableCell>
            <TableCell width={1}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow
              key={transaction.id}
              sx={{
                "& td": {
                  color:
                    transaction.monetaryOperation === "expense"
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                },
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell>
                {format(transaction.date, "yyyy-MM-dd")}
                <br />
                {format(transaction.date, "HH:mm")}
              </TableCell>
              <TableCell>
                <Grid container spacing={1}>
                  {transaction?.tags?.map((tag, index) => (
                    <Grid key={`${tag}-${index}`}>
                      <Chip label={tag.title} />
                    </Grid>
                  ))}
                </Grid>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h4">
                  {transaction.amount.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>
                {transaction.info ? (
                  <Tooltip title={transaction.info}>
                    <InfoOutlined />
                  </Tooltip>
                ) : null}
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="edit"
                  onClick={() => {
                    setModalState({
                      monetaryOperation: transaction.monetaryOperation,
                      transaction,
                    })
                    setModalOpen(true)
                  }}
                >
                  <Edit />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LastTransactions

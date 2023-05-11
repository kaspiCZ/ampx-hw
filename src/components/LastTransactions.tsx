import { useSetRecoilState } from "recoil"
import { deleteDoc, doc } from "firebase/firestore"
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material"
import { Delete, Edit } from "@mui/icons-material"
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
            <TableCell>Date</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell width={2}></TableCell>
            <TableCell width={2}></TableCell>
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
                {format(new Date(transaction.date), "yyyy-MM-dd HH:mm:ss")}
              </TableCell>
              <TableCell>
                {transaction?.tags?.map((tag, index) => (
                  <Chip label={tag} key={`${tag}-${index}`} />
                ))}
              </TableCell>
              <TableCell align="right">
                <Typography variant="h4">
                  {transaction.amount.toFixed(2)}
                </Typography>
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

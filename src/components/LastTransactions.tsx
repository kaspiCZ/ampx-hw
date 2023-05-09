import { useMemo, useState } from "react"
import {
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"
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
import { Delete } from "@mui/icons-material"
import { format } from "date-fns"

import { MonetaryOperation } from "../types"
import { auth, db } from "../firebase"

type Tags = {
  [id in string]: string
}

type Transaction = {
  id: string
  amount: number
  date: string
  monetaryOperation: MonetaryOperation
  tags: []
}

const LastTransactions = () => {
  const theme = useTheme()
  const [tags, setTags] = useState<Tags>()
  const [transactions, setTransactions] = useState<Transaction[]>()

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id))
    } catch (error) {
      console.error(error)
    }
  }

  useMemo(() => {
    try {
      const tagsSnapshot = query(
        collection(db, "tags"),
        where("uid", "==", auth.currentUser?.uid),
      )

      onSnapshot(tagsSnapshot, (querySnapshot) => {
        const newTags: Tags = {}

        querySnapshot.docs.forEach((document) => {
          newTags[document.id] = document.data().name
        })

        setTags(newTags)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  useMemo(() => {
    try {
      const transactionsSnapshot = query(
        collection(db, "transactions"),
        where("uid", "==", auth.currentUser?.uid),
        orderBy("date", "desc"),
        limit(10),
      )

      onSnapshot(transactionsSnapshot, (querySnapshot) => {
        setTransactions(
          querySnapshot.docs.map((document) => {
            const { id } = document
            const {
              amount,
              date,
              monetaryOperation,
              tags: tagsRef,
            } = document.data()

            return {
              id,
              amount,
              date,
              monetaryOperation,
              tags: tagsRef?.map(({ id }: { id: string }) => tags?.[id]),
            }
          }),
        )
      })
    } catch (error) {
      console.error(error)
    }
  }, [tags])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="right">Amount</TableCell>
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

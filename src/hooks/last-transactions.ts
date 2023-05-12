import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import {
  QueryConstraint,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"

import { Transaction } from "../types"
import { auth, db } from "../firebase"
import { aTags } from "../state/atoms/ui"

// TODO write tests with Firebase mocks

const useLastTransactions = (limitTo = 10) => {
  const mappedTags = useRecoilValue(aTags)
  const [transactions, setTransactions] = useState<Transaction[]>()

  useEffect(() => {
    try {
      const constraints: QueryConstraint[] = [
        where("uid", "==", auth.currentUser?.uid),
        orderBy("date", limitTo > 0 ? "desc" : "asc"),
      ]

      if (limitTo > 0) {
        constraints.push(limit(limitTo))
      }

      const transactionsSnapshot = query(
        collection(db, "transactions"),
        ...constraints,
      )

      const unsubscribe = onSnapshot(transactionsSnapshot, (querySnapshot) => {
        setTransactions(
          querySnapshot.docs.map((document) => {
            const { id } = document
            const {
              amount,
              date,
              monetaryOperation,
              tags: tagsRef,
              info,
            } = document.data()

            const transaction: Transaction = {
              id,
              amount,
              date: new Date(date),
              monetaryOperation,
              tags: tagsRef?.map(({ id }: { id: string }) => ({
                id,
                title: mappedTags?.[id],
              })),
            }

            if (info) {
              transaction.info = info
            }

            return transaction
          }),
        )
      })

      return () => {
        unsubscribe()
      }
    } catch (error) {
      console.error(error)
    }
  }, [limitTo, mappedTags])

  return transactions
}

export default useLastTransactions

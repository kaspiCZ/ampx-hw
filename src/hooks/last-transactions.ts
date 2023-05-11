import { useMemo, useState } from "react"
import { useRecoilValue } from "recoil"
import {
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

const useLastTransactions = () => {
  const mappedTags = useRecoilValue(aTags)
  const [transactions, setTransactions] = useState<Transaction[]>()

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
              tags: tagsRef?.map(({ id }: { id: string }) => mappedTags?.[id]),
            }
          }),
        )
      })
    } catch (error) {
      console.error(error)
    }
  }, [mappedTags])

  return transactions
}

export default useLastTransactions

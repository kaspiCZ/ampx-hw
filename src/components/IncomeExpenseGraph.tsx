import { Card, CardContent, useTheme } from "@mui/material"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format } from "date-fns"

import { Transaction } from "../types"
import useLastTransactions from "../hooks/last-transactions"

type DataPoint = {
  date: string
  sum: number
}

/**
 * TODO test datapoints exist
 * TODO fix responsive resizing against LastTransactions
 */
const IncomeExpenseGraph = () => {
  const theme = useTheme()
  const transactions = useLastTransactions(0)

  const groupedTransactions = transactions?.reduce(
    (groups: Record<string, Transaction[]>, transaction) => {
      const date = format(transaction.date, "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(transaction)

      return groups
    },
    {},
  )

  let data: DataPoint[] = []
  let dataMin = 0
  let dataMax = 0
  if (groupedTransactions) {
    data = Object.keys(groupedTransactions).map((date) => {
      const sum = groupedTransactions[date].reduce(
        (accumulatedSum, transaction) => {
          accumulatedSum +=
            transaction.monetaryOperation === "expense"
              ? transaction.amount * -1
              : transaction.amount

          return accumulatedSum
        },
        0,
      )

      dataMin = sum < dataMin ? sum : dataMin
      dataMax = sum > dataMax ? sum : dataMax

      return {
        date,
        sum,
      }
    })
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" interval="preserveStartEnd" />
            <YAxis domain={[dataMin, dataMax]} />
            <Tooltip />
            <ReferenceLine y={0} />
            <Bar dataKey="sum">
              {data?.map((dataPoint) => (
                <Cell
                  key={dataPoint.date}
                  fill={
                    dataPoint.sum >= 0
                      ? theme.palette.success[theme.palette.mode]
                      : theme.palette.error[theme.palette.mode]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default IncomeExpenseGraph

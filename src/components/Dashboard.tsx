import { Box, Unstable_Grid2 as Grid } from "@mui/material"
import useTags from "../hooks/tags"

import LastTransactions from "./LastTransactions"
import IncomeExpenseGraph from "./IncomeExpenseGraph"

const Dashboard = () => {
  useTags() // load tags before use (mapping to transactions)

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={7}>
          <IncomeExpenseGraph />
        </Grid>
        <Grid xs={12} md={5}>
          <LastTransactions />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard

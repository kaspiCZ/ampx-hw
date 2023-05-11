import useTags from "../hooks/tags"

import LastTransactions from "./LastTransactions"

const Dashboard = () => {
  useTags() // load tags before use (mapping to transactions)

  return <LastTransactions />
}

export default Dashboard

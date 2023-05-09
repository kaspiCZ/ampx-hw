// import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
// import { db } from "../firebase"
// import { Auth } from "firebase/auth"

// const dashboardLoader = (auth: Auth) => {
//   const snapshot = query(
//     collection(db, "transactions"),
//     where("uid", "==", auth.currentUser?.uid),
//     orderBy("date", "desc"),
//   )

//   onSnapshot(snapshot, (querySnapshot) => {
//     setTransactions(
//       querySnapshot.docs.map((doc) => {
//         const { amount, date, monetaryOperation } = doc.data()
//         return { amount, date, monetaryOperation }
//       }),
//     )
//   })
// }

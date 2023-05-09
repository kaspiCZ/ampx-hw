// import { AtomEffect } from "recoil"

// const localStorageEffect = <T>(key: string) => {
//   const curried: AtomEffect<T> = ({ setSelf, onSet }) => {
//     const savedValue = localStorage.getItem(key)

//     if (savedValue !== null) {
//       setSelf(JSON.parse(savedValue))
//     }

//     onSet((newValue, _, isReset) => {
//       isReset
//         ? localStorage.removeItem(key)
//         : localStorage.setItem(key, JSON.stringify(newValue))
//     })
//   }

//   return curried
// }

// export default localStorageEffect

export const say = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('heheda')
    }, 3000)
  })
}
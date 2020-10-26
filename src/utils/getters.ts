export const ID = /\d+/

export const getID = (path: string) => {
  const found = path.match(ID)
  return +found[found.length - 1]
}

import fs from "fs";

export const saveData = async (productsArray: any, dataName: string) => {
  console.log(productsArray)
  fs.writeFile(dataName, JSON.stringify(productsArray), (err: any) => {
    if (err) throw (err)
    console.log('Data saved')
  })
}
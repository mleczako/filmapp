import { BASE_URL } from "./Key.js"

/*aby dzialalo trzeba zrobic dwie rzeczy 
1. na stronie https://www.omdbapi.com/apikey.aspx musicie wygenerowac swoj klucz api
2. stworzyc plik Key.js w folderze services
(musi byc doklanie Kej.js w folderze services bo taki bo taki plik jest dodany od gitignore)
stuktura pliku:

const API_KEY = ""
const BASE_URL = ""`
*/

export const getIronManMovie = async () => {
    const response = await fetch(`${BASE_URL}/?t=Iron+Man`)
    const data = await response.json()
    return data.results
};
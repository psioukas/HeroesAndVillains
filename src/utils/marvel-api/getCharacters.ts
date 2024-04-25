const BASE_URL = 'https://gateway.marvel.com:443/v1/public'
const API_KEY = '13d4e175b3501e8220a083e497e3d4d1'

export function getCharacters() {
    return fetch(`${BASE_URL}/characters?apikey=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data.data.results
        })
}

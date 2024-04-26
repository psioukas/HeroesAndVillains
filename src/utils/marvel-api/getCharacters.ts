const BASE_URL = 'https://gateway.marvel.com:443/v1/public'

export function getCharacters() {
    return fetch(`${BASE_URL}/characters?apikey=${process.env.MARVEL_API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            return data.data.results
        })
}

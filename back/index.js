const express = require('express')
const app = express()
const port = 3000
const qs = require('qs')
const axios = require('axios')
const apiKey = process.env.VUE_APP_API_KEY
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather'
app.get('/', (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', 'https://weather.noagobert.dev/')
    let query = request.query
    query.appid = apiKey
    let queryString = qs.stringify(query)
    axios.get(`${apiUrl}?${queryString}`).then(res => {
        response.send(res.data)

    })
})


app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`)
})
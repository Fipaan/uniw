# Weather API

## Credits

- Name: Roman
- Surname: Mozgovoy
- Group: SE-2419
- Topic: Weather API using Express JS

## Setup

### Prerequisites (env. variables)

- SMTP_HOST       - through what you are going to send email
- SMTP_PORT       - through which port
- SMTP_USER       - who is sender
- SMTP_PASS       - app password
- OPENWEATHER_KEY - app key from [OpenWaterAPI](https://home.openweathermap.org)

### Enable server

```sh
$ npm install
$ node src/app.js
```

## API usage

```js
GET:    "/api/weather"       // returns list of cities as JSON with weather data
GET:    "/api/weather/:city" // returns specified city as JSON (with data)
POST:   "/api/weather/:city" // adds city to favorites list, and returns specified city as JSON (with data)
PUT:    "/api/weather/:city", json: {"index": ...} // moves given city to corresponding index, returns OK
DELETE: "/api/weather/:city" // deletes city from favorites list, returns OK
POST:   "/api/weather/sub" , json: {"email": ..., "city": ...} // subscribes specified email to regular weather update
```
> note: all API points return json, and JSON will contain "error" field if it was occured

## Key decisions

- I used environment variables to make code more secure, and doesn't store sensible data directly in the code
- API was mostly designed by assignment criteria, but for subscription point I decided to get input entirely from JSON, because it's easier to parse on Express part
- Mostly I focused on backend, and kept frontend minimal (just to showcase functionality of API)
- I used 3000 port for the server, because criteria said so
- For maps I used Leaflet, because it was easy to setup, and had exact functionality I need (display points by longitude and latitude on the map)
- Implemented fully SMTP scheduler (09:00 AM, 01:00 PM, 08:00 PM, and next day info on 10:00 PM)
- Add throttling when trying to access OpenWeatherAPI, because it has limited call count, so I can't call it too frequently

# Simple Voice Call Dialer
Simple API Request based Voice Call Dialer with the use of CSV

### Setup (Local)
1. clone this repo
2. run `npm install`
3. setup `.env` according to `.env.example`
4. run `npm start`

### Setup (Heroku)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nexmo-se/simple-voice-call-dialer)


### Using the application
1. CSV Template (`mobile_number,voice_name,text_body`)
2. Send the CSV file via `POST` to `{HOST}/upload` with file parameter `file`.
3. Blaster will start to blast.

### Sample CSV
```
6512341234,kimberly,This is a text
6556785678,kimberly,This is another text
```
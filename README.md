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
1. CSV Template (`mobile_number,voice_name,text_body[,voice_name,text_body]`)
   Voice Names can be found under https://developer.nexmo.com/voice/voice-api/guides/text-to-speech
   For Streaming, use `stream` for the Voice Name and the public accessible URL for the Text Body.
2. Send the CSV file via `POST` to `{HOST}/upload` with file parameter `file`.
3. Blaster will start to blast.

### Sample CSV
```
6512341234,kimberly,This is a text
6556785678,stream,https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3
6512341234,kimberly,This is text 1,kimberly,This is text 2
6556785678,kimberly,This is text 1,stream,https://nexmo-community.github.io/ncco-examples/assets/voice_api_audio_streaming.mp3
```
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const helmet = require('helmet');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const fileService = require('./services/file');
const csvService = require('./services/csv');
const callService = require('./services/call');
const mapperService = require('./services/mapper');
const rateLimiterService = require('./services/rateLimiter');

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage }).single('file');

const host = process.env.HOST;
const port = process.env.PORT || 8080;
const apiUrl = process.env.API_URL;
const apiAppId = process.env.API_APPLICATION_ID;
const apiPrivateKey = process.env.API_PRIVATE_KEY.replace(/\\n/g, '\n');
const callerId = process.env.CALLER_ID;
const cps = parseInt(process.env.CPS || '3', 10);
const csvFromLine = parseInt(process.env.CSV_SKIP_LINES || '0', 10) + 1;

const rateLimitAxios = rateLimiterService.newInstance(cps);


// Always use UTC Timezone
process.env.TZ = 'Etc/UTC';
const requestMaxSize = '150mb';

// Ensure existence of report directory
if (!fs.existsSync('src/report')) {
  fs.mkdirSync('src/report');
}

const app = express();

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: requestMaxSize }));
app.use(bodyParser.json({ limit: requestMaxSize }));

app.get('/', (_, res) => res.send('Hello world'));
app.use('/static/report', express.static('src/report'));
app.get('/success', (_, res) => res.send('You have successfully deployed the Simple Voice Dialer'));

app.post('/event/:campaignName', (req, res) => {
  const { body: data } = req;
  const { campaignName } = req.params;
  const mappedEvent = mapperService.mapEvent(data);
  const csvContent = csvService.toCsv(mappedEvent);
  fileService.appendContent(`src/report/${campaignName}.csv`, csvContent);
  res.send('ok');
});

app.post('/blast', (req, res) => {
  const {
    campaignName,
    records,
    offset = 0,
    limit = cps,
  } = req.body;
  res.send('ok');

  if (offset > records.length) {
    // Done
    console.log('Done');
    return;
  }

  const eventUrl = `${host}/event/${campaignName}`;

  const end = Math.min(offset + limit, records.length);
  for (let i = offset; i < end; i += 1) {
    // Add to queue
    const record = records[i];
    const mappedRecord = mapperService.mapRecord(record);
    callService.call(
      callerId, mappedRecord.mobileNumber,
      apiUrl, apiAppId, apiPrivateKey,
      campaignName, mappedRecord.ncco, eventUrl,
      rateLimitAxios,
    );
  }

  console.log(`Blast Limit: ${limit}, Offset ${offset}`);
  setTimeout(() => axios.post(`http://localhost:${port}/blast`, {
    campaignName,
    records,
    offset: offset + limit,
    limit,
  }, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  }), 1000);
});

app.post('/upload', upload, (req, res) => {
  // Campaign name
  let campaignName = req.file.originalname;
  if (campaignName.toLowerCase().lastIndexOf('.csv') === campaignName.length - 4) {
    campaignName = campaignName.slice(0, campaignName.length - 4);
  }
  campaignName = campaignName.replace(/\./g, '_');
  console.log(`Campaign Name: ${campaignName}`);

  // Data will be in req.file.buffer
  const dataBuffer = req.file.buffer;
  const dataString = dataBuffer.toString('utf8');

  res.send('ok');

  const options = { from_line: csvFromLine, relax_column_count: true };
  const recordList = csvService.fromCsv(dataString, options);
  setImmediate(() => axios.post(`http://localhost:${port}/blast`, {
    campaignName,
    records: recordList,
    offset: 0,
    limit: cps,
  }, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  }));
});

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const windows1252 = require('windows-1252');
const utf8 = require('utf8');

const convertToUtf8 = (text) => {
  if (text == null) {
    return null;
  }
  const encoded = windows1252.encode(text);
  const decoded = utf8.decode(encoded);
  return decoded;
};

const mapRecord = (record) => {
  const mappedRecord = {
    mobileNumber: record[0],
    ncco: [],
  };

  for (let i = 1; (i + 1) < record.length; i += 2) {
    const type = convertToUtf8(record[i]);
    const value = convertToUtf8(record[i + 1]);

    if (type === 'stream') {
      // Stream
      mappedRecord.ncco.push({
        action: 'stream',
        streamUrl: [value],
      });
    } else {
      // Talk
      mappedRecord.ncco.push({
        action: 'talk',
        text: value,
        voiceName: type,
      });
    }
  }

  return mappedRecord;
};

const mapEvent = (data) => {
  console.log(data);
  return [];
};

module.exports = {
  mapRecord,
  mapEvent,
};

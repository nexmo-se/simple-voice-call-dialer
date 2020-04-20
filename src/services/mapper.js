const mapRecord = (record) => {
  const mappedRecord = {
    mobileNumber: record[0],
    ncco: [],
  };

  for (let i = 1; (i + 1) < record.length; i += 2) {
    const type = record[i];
    const value = record[i + 1];

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

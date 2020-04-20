const fs = require('fs');

const appendContent = (path, content) => {
  const buffer = Buffer.from(content, 'utf8');
  appendBuffer(path, buffer);
};

const appendBuffer = (path, buffer) => {
  fs.writeFileSync(path, buffer, { flag: 'a' });
};

module.exports = {
  appendContent,
  appendBuffer,
};

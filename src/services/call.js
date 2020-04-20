const nexmo = require('nexmo');

const getJwt = (applicationId, privateKey) => {
  let sanitizedPrivateKey = privateKey;
  if (sanitizedPrivateKey.indexOf('-----BEGIN PRIVATE KEY-----') === 0) {
    sanitizedPrivateKey = Buffer.from(sanitizedPrivateKey);
  }
  const jwt = nexmo.generateJwt(sanitizedPrivateKey, {
    application_id: applicationId,
  });

  return jwt;
};

const call = (
  fromNumber, toNumber,
  apiUrl, apiAppId, apiPrivateKey,
  campaignName, ncco, eventUrl,
  axios,
) => {
  const jwt = getJwt(apiAppId, apiPrivateKey);
  const body = {
    from: {
      type: 'phone',
      number: fromNumber,
    },
    to: [
      {
        type: 'phone',
        number: toNumber,
      },
    ],
    ncco,
    event_url: [eventUrl],
    event_method: 'POST',
  };
  const config = {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };

  return axios.post(apiUrl, body, config)
    .catch((error) => {
      if (error.response != null && error.response.status === 429) {
        console.log('Too many request (429) detected, put back into queue');
        return call(
          fromNumber, toNumber,
          apiUrl, apiAppId, apiPrivateKey,
          campaignName, ncco, eventUrl,
          axios,
        );
      }

      console.error(error.message);
      console.error(error);
      return Promise.resolve();
    });
};

module.exports = {
  call,
};

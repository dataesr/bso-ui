// node bso-local-variation-validation.mjs anne.lhote@gmail.com,anne.lhote@recherche.gouv.fr 130015506
import Axios from 'axios';
import https from 'node:https';

import locals from './src/config/locals.json' assert { type: "json" };

const sendEmail = (emails, structureId, structureName) => {
  const to = emails.split(',').map((email) => ({ email, name: email }))
  const options = {
    method: 'POST',
    url: 'https://barometredelascienceouverte.esr.gouv.fr/mailer/',
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: { 'Content-Type': 'application/json' },
    data: {
      to: [
        {
          email: 'bso@recherche.gouv.fr',
          // Encode UTF8
          name: JSON.parse(JSON.stringify('Baromètre français de la Science Ouverte')),
        },
        ...to,
      ],
      templateId: 234,
      params:{
        "structureName": structureName,
        "structureId": structureId,
      },
    },
  };

  Axios.request(options)
    .then(() => {
      console.log('Email sent');
    })
    .catch((e) => {
      console.error('!!! ERROR !!!');
      console.error(e);
    });
};

if (process.argv.length === 4) {
  const emails = process.argv[2];
  const structureId = process.argv[3];
  const structureName = locals?.[structureId]?.commentsName;
  if (structureName) {
    sendEmail(emails, structureId, structureName);
  } else {
    console.error(`This structureId "${structureId}" does not exists in locals config file (src/config/locals.json).`);
  }
} else {
  console.error('Misuse, this command line require 2 arguments : email address and structure id');
}

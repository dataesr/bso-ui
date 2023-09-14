// node --experimental-specifier-resolution=node bso-local-variation-validation.mjs anne.lhote@gmail.com 130015506
import Axios from 'axios';
import https from 'node:https';

import locals from './src/config/locals.json' assert { type: "json" };

const sendEmail = (email, structureId, structureName) => {
  const options = {
    method: 'POST',
    url: 'https://barometredelascienceouverte.esr.gouv.fr/mailer/',
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    headers: { 'Content-Type': 'application/json' },
    data: {
      to: [
        {
          email: 'bso@recherche.gouv.fr',
          name: 'Baromètre français de la Science Ouverte',
        },
        { email, name: email },
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
  const email = process.argv[2];
  const structureId = process.argv[3];
  const structureName = locals?.[structureId]?.commentsName;
  if (structureName) {
    sendEmail(email, structureId, structureName);
  } else {
    console.error(`This structureId "${structureId}" does not exists in locals config file (src/config/locals.json).`);
  }
} else {
  console.error('Misuse, this command line require 2 arguments : email address and structure id');
}

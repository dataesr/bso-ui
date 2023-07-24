// node --experimental-specifier-resolution=node bso-local-variation-validation.mjs anne.lhote@gmail.com 123456
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
      sender: {
        email: 'bso@recherche.gouv.fr',
        name: 'Baromètre français de la Science Ouverte',
      },
      to: [
        {
          email: 'bso@recherche.gouv.fr',
          name: 'Baromètre français de la Science Ouverte',
        },
        { email, name: email },
      ],
      subject: "Nouveau baromètre local",
      htmlContent: `
        <html><body>
        <p>Bonjour,</p>
        <p>Les publications ${structureName} sont bien intégrées, et vous pouvez dorénavant prévisualiser
        chaque graphique disponible via cette page
        <a href="https://barometredelascienceouverte.esr.gouv.fr/declinaisons/comment-realiser-bso-local" target="_blank">
        https://barometredelascienceouverte.esr.gouv.fr/declinaisons/comment-realiser-bso-local</a>
        avec votre identifiant établissement ${structureId}.</p>
        <p>N'hésitez pas à vérifier que chaque graphique et son commentaire vous semble correct.</p>
        <p>Les données enrichies sont disponibles (en csv et json lines). Le fichier jsonl contient toutes les données en
        historique (statut OA pour chaque DOI et à chaque date d'observation).</p>
        <p><a href="https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${structureId}_enriched.csv.gz" target="_blank">
        https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${structureId}_enriched.csv.gz</a></p>
        <p>et</p>
        <p><a href="https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${structureId}_enriched.jsonl.gz" target="_blank">
        https://storage.gra.cloud.ovh.net/v1/AUTH_32c5d10cb0fe4519b957064a111717e3/bso_dump/bso-publications-latest_${structureId}_enriched.jsonl.gz</a></p>
        <p>Nous restons à votre disposition pour toute question / remarque concernant le BSO.</p>
        <p>Cordialement,</p>
        <p>L'équipe du BSO</p>
        </body></html>
        `,
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

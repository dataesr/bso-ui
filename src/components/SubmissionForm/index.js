import './style.scss';

import {
  Button,
  Col,
  Container,
  File,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import Axios from 'axios';
import Papa from 'papaparse';
import { useState } from 'react';
import { read, utils } from 'xlsx';

const SUPPORTED_MIME_TYPES = [
  'application/msexcel',
  'application/vnd.ms-excel',
  'application/vnd.ms-office',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd-xls',
  'application/x-dos_ms_excel',
  'application/x-excel',
  'application/x-ms-excel',
  'application/x-msexcel',
  'application/x-xls',
  'application/xls',
  'text/csv',
];
// DOI does not contain comma
const doiRegex = /^[^,]+$/;
// hal_struct_id is only digits
const halStructIdRegex = /^\d*$/;
// hal_id
const halIdRegex = /^[a-zA-Z0-9]{3,}(-|_)(\d{8})$/;
// https://documentation.abes.fr/sudoc/regles/CodesUnivEtab.htm
const nntEtabRegex = /^[a-zA-Z0-9]{4,6}$/;
// https://documentation.abes.fr/sudoc/regles/Catalogage/Retro_CodeCourt_NNT.htm
const nntIdRegex = /^(19|20)\d{2}[A-Z]{4}\w{4}$/;

const SubmissionForm = () => {
  const [acronym, setAcronym] = useState();
  const [doiCount, setDoiCount] = useState();
  const [email, setEmail] = useState();
  const [dataFile, setDataFile] = useState();
  const [halCollCodeCount, setHalCollCodeCount] = useState();
  const [halIdCount, setHalIdCount] = useState();
  const [halStructIdCount, setHalStructIdCount] = useState();
  const [isError, setIsError] = useState(true);
  const [message, setMessage] = useState();
  const [name, setName] = useState();
  const [nntEtabCount, setNntEtabCount] = useState();
  const [nntIdCount, setNntIdCount] = useState();
  const [rnsr, setRnsr] = useState();

  const resetState = () => {
    setDoiCount(undefined);
    setHalCollCodeCount(undefined);
    setHalIdCount(undefined);
    setHalStructIdCount(undefined);
    setIsError(true);
    setMessage(undefined);
    setNntEtabCount(undefined);
    setNntIdCount(undefined);
    setRnsr(undefined);
  };

  const sendEmail = (event) => {
    event.preventDefault();
    const txt = Papa.unparse(dataFile, {
      delimiter: ',',
      header: true,
      skipEmptyLines: 'greedy',
    });
    let content = '';
    try {
      content = window.btoa(txt);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setIsError(true);
      setMessage(
        "Erreur lors de l'encodage de votre fichier, merci de contacter bso@recherche.gouv.fr.",
      );
      return;
    }

    const options = {
      method: 'POST',
      url: `${window.location.origin}/mailer/`,
      headers: {
        'Content-Type': 'application/json',
      },
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
        subject: "Demande d'un nouveau BSO Local",
        htmlContent: `<html><body>
          <p>Email de contact: ${email}</p>
          <p>Nom de la structure: ${name}</p>
          <p>Acronyme de la structure: ${acronym}</p>
          <p>RNSR de la structure: ${rnsr}</p>
          </body></html>`,
        attachment: [{ content, name: 'bso.csv' }],
      },
    };

    Axios.request(options)
      .then(() => {
        resetState();
        setMessage(
          "Merci pour votre envoi! Si tout s'est bien passé, vous allez recevoir une copie du mail envoyé à l'équipe du baromètre.",
        );
      })
      .catch(() => {
        setIsError(true);
        setMessage(
          "Error lors de l'envoi de votre fichier, merci de contacter bso@recherche.gouv.fr.",
        );
      });
  };

  const readCSV = (input) => {
    Papa.parse(input, {
      header: true,
      skipEmptyLines: 'greedy',
      transform: (value) => value.trim(),
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: ({ data, meta }) => {
        // Add line number
        const dataWithLine = data.map((item, index) => ({
          ...item,
          line: index + 2,
        }));
        // Check if headers are present
        if (!meta.fields.includes('doi')) {
          setMessage(
            "Merci de préciser les noms de colonne dans votre fichier. Si besoin, utiliser le fichier d'exemple.",
          );
        } else if (
          dataWithLine.some(
            (item) => item?.hal_struct_id
              && !item?.hal_struct_id?.match(halStructIdRegex),
          )
        ) {
          const errors = dataWithLine.filter(
            (item) => item?.hal_struct_id
              && !item?.hal_struct_id?.match(halStructIdRegex),
          );
          let errorMessage = 'Vos "hal_struct_id" doivent être une suite de chiffres.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "hal_struct_id" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            errorMessage += `<li>Ligne ${item?.line} : Donnée en extra ${item?.hal_struct_id}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithLine.some(
            (item) => item?.hal_id && !item?.hal_id?.match(halIdRegex),
          )
        ) {
          const errors = dataWithLine.filter(
            (item) => item?.hal_id && !item?.hal_id?.match(halIdRegex),
          );
          let errorMessage = 'Vos "hal_id" ne respectent pas le format imposé.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "hal_id" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            errorMessage += `<li>Ligne ${item?.line} : Donnée en extra ${item?.hal_id}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithLine.some(
            (item) => item?.nnt_etab && !item?.nnt_etab?.match(nntEtabRegex),
          )
        ) {
          const errors = dataWithLine.filter(
            (item) => item?.nnt_etab && !item?.nnt_etab?.match(nntEtabRegex),
          );
          let errorMessage = 'Vos "nnt_etab" doivent être une suite de 4, 5 ou 6 chiffres ou lettres.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "nnt_etab" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            errorMessage += `<li>Ligne ${item?.line} : Donnée en extra ${item?.nnt_etab}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithLine.some(
            (item) => item?.nnt_id && !item?.nnt_id?.match(nntIdRegex),
          )
        ) {
          const errors = dataWithLine.filter(
            (item) => item?.nnt_id && !item?.nnt_id?.match(nntIdRegex),
          );
          let errorMessage = 'Vos "nnt_id" doivent être une année de soutenance suivie de 4 lettres majuscules puis de 4 caractères alphanumériques tel que décrit ';
          errorMessage
            += '<a href="https://documentation.abes.fr/sudoc/regles/Catalogage/Retro_CodeCourt_NNT.htm" target="_blank">sur cette page</a>.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "nnt_id" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            errorMessage += `<li>Ligne ${item?.line} : Donnée en extra ${item?.nnt_id}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          // eslint-disable-next-line no-underscore-dangle
          dataWithLine.some((item) => item?.__parsed_extra)
        ) {
          // eslint-disable-next-line no-underscore-dangle
          const errors = dataWithLine.filter((item) => item?.__parsed_extra);
          let errorMessage = 'Il y a des souci(s) de donnée  dans votre fichier CSV.';
          errorMessage += ` Il y a ${errors.length} soucis à la ligne!`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            // eslint-disable-next-line no-underscore-dangle
            errorMessage += `<li>Ligne ${item?.line} : Donnée en extra ${item?.__parsed_extra}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithLine.some((item) => item?.doi && !item?.doi?.match(doiRegex))
        ) {
          const errors = dataWithLine.filter(
            (item) => item?.doi && !item?.doi?.match(doiRegex),
          );
          let errorMessage = 'Les DOI ne doivent pas contenir de virgule.';
          errorMessage += ` Erreur(s) sur ${errors.length} DOI :`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            errorMessage += `<li>Ligne ${item?.line} : DOI ${item?.doi}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
          // Check if there is data to send
        } else if (
          doiCount === 0
          && halCollCodeCount === 0
          && halIdCount === 0
          && halStructIdCount === 0
          && nntEtabCount === 0
          && nntIdCount === 0
        ) {
          setMessage(
            "Il semblerait qu'il n'y ait aucune donnée à envoyer. Merci de vérifier votre fichier.",
          );
        } else {
          setIsError(false);
          setDataFile(data);
          setDoiCount(data.filter((item) => item?.doi)?.length);
          setHalCollCodeCount(
            data.filter((item) => item?.hal_coll_code)?.length,
          );
          setHalIdCount(data.filter((item) => item?.hal_id)?.length);
          setHalStructIdCount(
            data.filter((item) => item?.hal_struct_id)?.length,
          );
          setNntEtabCount(data.filter((item) => item?.nnt_etab)?.length);
          setNntIdCount(data.filter((item) => item?.nnt_id)?.length);
        }
      },
      error: () => {
        setMessage(
          "Erreur lors du chargement du fichier. Merci d'en vérifier le format.",
        );
      },
    });
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    resetState();
    if (e.target.files.length !== 1) {
      setMessage('Merci de soumettre un et un seul fichier !');
    } else if (!SUPPORTED_MIME_TYPES.includes(e.target.files?.[0]?.type)) {
      setMessage('Les formats de fichier acceptés sont .csv, .xls ou .xlsx !');
    } else {
      const inputFile = e.target.files[0];
      if (inputFile?.type === 'text/csv') {
        readCSV(inputFile);
      } else {
        const buffer = await inputFile.arrayBuffer();
        const workbook = read(buffer);
        if (workbook.SheetNames.length > 1) {
          setMessage(
            "Attention, il semblerait que votre fichier ait plus d'un onglet. Merci de ne soumettre qu'un seul onglet",
          );
        }
        const data = utils.sheet_to_csv(
          workbook.Sheets[workbook.SheetNames[0]],
          { FS: ',' },
        );
        readCSV(data);
      }
    }
  };

  return (
    <Container>
      <section className='content bd125 mb-20'>
        <Row gutters>
          <Col n='12 lg-8'>
            <div>
              Vous pouvez nous envoyer votre fichier tout au long de l'année.
              Les dates de constitution et d'envoi de ce fichier n'ont pas
              d'incidence sur les graphiques générés car ceux-ci reposent sur
              des "snapshots" des outils utilisés (Unpaywall, PubMed...).
            </div>
            <br />
            <form onSubmit={sendEmail}>
              <TextInput
                autoComplete='email'
                autoFocus
                label='Email de contact'
                onChange={(e) => setEmail(e.target.value)}
                required
                type='email'
                value={email}
              />
              <TextInput
                label='Nom de la structure'
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
              />
              <TextInput
                label='Acronyme de la structure'
                onChange={(e) => setAcronym(e.target.value)}
                value={acronym}
              />
              <TextInput
                label='RNSR de la structure'
                onChange={(e) => setRnsr(e.target.value)}
                value={rnsr}
              />
              <File
                hint="Fichier Excel ou CSV (séparateur point virgule ;). Merci d'inclure une ligne d'en-têtes avec les noms de colonnes, comme dans le fichier exemple."
                label='Fichier de publications'
                onChange={handleFileChange}
              />
              {message && (
                <span className={isError ? 'text-red' : 'text-green'}>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: message }}
                  />
                </span>
              )}
              {!!(
                doiCount
                || halCollCodeCount
                || halIdCount
                || halStructIdCount
                || nntEtabCount
                || nntIdCount
              ) && (
                <div>
                  Ce fichier contient :
                  <ul>
                    {!!doiCount && <li>{`${doiCount} DOI`}</li>}
                    {!!halCollCodeCount && (
                      <li>{`${halCollCodeCount} hal_coll_code`}</li>
                    )}
                    {!!halIdCount && <li>{`${halIdCount} hal_id`}</li>}
                    {!!halStructIdCount && (
                      <li>{`${halStructIdCount} hal_struct_id`}</li>
                    )}
                    {!!nntEtabCount && <li>{`${nntEtabCount} nnt_etab`}</li>}
                    {!!nntIdCount && <li>{`${nntIdCount} nnt_id`}</li>}
                  </ul>
                </div>
              )}
              <Button
                className='mt-20'
                disabled={email?.length === 0 || name?.length === 0 || isError}
                submit
              >
                Envoyer
              </Button>
            </form>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default SubmissionForm;

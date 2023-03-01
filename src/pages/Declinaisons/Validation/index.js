import './style.scss';

import {
  Button,
  Col,
  Container,
  File,
  Icon as DSIcon,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import Axios from 'axios';
import Papa from 'papaparse';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { read, utils } from 'xlsx';

import Banner from '../../../components/Banner';

const DELIMITER = ';';
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

const renderIcons = (
  <Row justifyContent='center' alignItems='middle' gutters>
    <Col n='12'>
      <DSIcon
        name='icon-bsso-23'
        color1='blue-soft-125'
        color2='blue-soft-75'
      />
    </Col>
  </Row>
);

function Validation() {
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
  const [firstPublicationYear, setFirstPublicationYear] = useState(2013);

  const resetState = () => {
    setDoiCount(undefined);
    setHalCollCodeCount(undefined);
    setHalIdCount(undefined);
    setHalStructIdCount(undefined);
    setIsError(true);
    setMessage(undefined);
    setNntEtabCount(undefined);
    setNntIdCount(undefined);
  };

  const sendEmail = () => {
    const txt = Papa.unparse(dataFile, {
      delimiter: DELIMITER,
      header: true,
      skipEmptyLines: 'greedy',
    });
    const content = btoa(txt);
    const options = {
      method: 'POST',
      url: `${window.location.origin}/mailer/`,
      headers: {
        Authorization: 'Basic YWRtaW46Qm91Y2hlcmllNDMx',
        'Content-Type': 'application/json',
      },
      data: {
        sender: { name: email, email },
        to: [{ email: 'bso@recherche.gouv.fr', name: 'MESR - BSO' }],
        subject: "Demande d'un nouveau BSO Local",
        htmlContent: `<html><body>
          <p>Email de contact: ${email}</p>
          <p>Nom de la structure: ${name}</p>
          <p>Acronyme de la structure: ${acronym}</p>
          <p>Première année de publication: ${firstPublicationYear}</p>
          </body></html>`,
        attachment: [{ content, name: 'bso.csv' }],
      },
    };

    Axios.request(options)
      .then(() => {
        resetState();
        setMessage('Merci pour votre envoi !');
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
      delimiter: DELIMITER,
      header: true,
      skipEmptyLines: 'greedy',
      complete: ({ data }) => {
        const dataWithIndex = data.map((item, index) => ({
          ...item,
          index: index + 2,
        }));
        if (
          dataWithIndex.some(
            (item) => item?.hal_struct_id
              && !item?.hal_struct_id?.match(halStructIdRegex),
          )
        ) {
          const errors = dataWithIndex.filter(
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
            errorMessage += `<li>Ligne ${item?.index} : Donnée en extra ${item?.hal_struct_id}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithIndex.some(
            (item) => item?.hal_id && !item?.hal_id?.match(halIdRegex),
          )
        ) {
          const errors = dataWithIndex.filter(
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
            errorMessage += `<li>Ligne ${item?.index} : Donnée en extra ${item?.hal_id}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithIndex.some(
            (item) => item?.nnt_etab && !item?.nnt_etab?.match(nntEtabRegex),
          )
        ) {
          const errors = dataWithIndex.filter(
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
            errorMessage += `<li>Ligne ${item?.index} : Donnée en extra ${item?.nnt_etab}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithIndex.some(
            (item) => item?.nnt_id && !item?.nnt_id?.match(nntIdRegex),
          )
        ) {
          const errors = dataWithIndex.filter(
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
            errorMessage += `<li>Ligne ${item?.index} : Donnée en extra ${item?.nnt_id}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          // eslint-disable-next-line no-underscore-dangle
          dataWithIndex.some((item) => item?.__parsed_extra)
        ) {
          // eslint-disable-next-line no-underscore-dangle
          const errors = dataWithIndex.filter((item) => item?.__parsed_extra);
          let errorMessage = 'Il y a des souci(s) de donnée  dans votre fichier CSV.';
          errorMessage += ` Il y a ${errors.length} soucis à la ligne!`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            // eslint-disable-next-line no-underscore-dangle
            errorMessage += `<li>Ligne ${item?.index} : Donnée en extra ${item?.__parsed_extra}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
        } else if (
          dataWithIndex.some((item) => item?.doi && !item?.doi?.match(doiRegex))
        ) {
          const errors = dataWithIndex.filter(
            (item) => item?.doi && !item?.doi?.match(doiRegex),
          );
          let errorMessage = 'Les DOI ne doivent pas contenir de virgule.';
          errorMessage += ` Erreur(s) sur ${errors.length} DOI :`;
          errorMessage += '<ul>';
          errors.forEach((item) => {
            errorMessage += `<li>Ligne ${item?.index} : DOI ${item?.doi}</li>`;
          });
          errorMessage += '</ul>';
          setMessage(errorMessage);
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
          { FS: DELIMITER },
        );
        readCSV(data);
      }
    }
  };

  return (
    <>
      <div className='page validation'>
        <Banner
          backgroundColor='blue-soft-50'
          textColor='blue-dark-150'
          supTitle={<FormattedMessage id='app.header.title' />}
          title={<FormattedMessage id='app.header.nav.a-propos-variations' />}
          icons={renderIcons}
        />
      </div>
      <Container>
        <section className='content bd125 mb-20'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h2 className='marianne-bold fs-12-16'>
                Formulaire de de mande de création ou de mise à jour d'un BSO
              </h2>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <TextInput
                label='Email de contact'
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <TextInput
                label='Nom de la structure'
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <TextInput
                label='Acronyme de la structure'
                onChange={(e) => setAcronym(e.target.value)}
                value={acronym}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <TextInput
                label='Première année de publication'
                onChange={(e) => setFirstPublicationYear(e.target.value)}
                type='number'
                value={firstPublicationYear}
              />
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <File
                hint='Fichier Excel ou CSV (séparateur point virgule ;). Merci de préciser le nom des colonnes.'
                label='Fichier de DOIs'
                onChange={handleFileChange}
              />
              {message && (
                <span className={isError ? 'text-red' : 'text-green'}>
                  <div dangerouslySetInnerHTML={{ __html: message }} />
                </span>
              )}
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              {(!!doiCount
                || !!halCollCodeCount
                || !!halIdCount
                || !!halStructIdCount
                || !!nntEtabCount
                || !!nntIdCount) && (
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
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <Button
                disabled={email?.length === 0 || name?.length === 0 || isError}
                onClick={() => sendEmail()}
              >
                Envoyer
              </Button>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
}

export default Validation;

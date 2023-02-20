import './style.scss';

import { Col, Container, File, Icon as DSIcon, Row } from '@dataesr/react-dsfr';
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
// hal_struct_id is only digits
const halStructIdRegex = /^\d*$/;
// hal_id is 'hal-' + digits
const halIdRegex = /^hal-\d+$/;
// https://documentation.abes.fr/sudoc/regles/CodesUnivEtab.htm
const nntEtabRegex = /^[A-Z]{4}[A-Z0-9]{0,1}$/;
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
  const [doiCount, setDoiCount] = useState(0);
  const [halCollCode, setHalCollCode] = useState(0);
  const [halId, setHalId] = useState(0);
  const [halStructId, setHalStructId] = useState(0);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [nntEtab, setNntEtab] = useState(0);
  const [nntId, setNntId] = useState(0);

  const readCSV = (input) => {
    Papa.parse(input, {
      config: { delimiter: DELIMITER },
      header: true,
      skipEmptyLines: 'greedy',
      complete: ({ data }) => {
        if (
          data.some(
            (item) => item?.hal_struct_id
              && !item?.hal_struct_id?.match(halStructIdRegex),
          )
        ) {
          const errors = data.filter(
            (item) => item?.hal_struct_id
              && !item?.hal_struct_id?.match(halStructIdRegex),
          );
          setIsError(true);
          let errorMessage = 'Vos "hal_struct_id" doivent être une suite de chiffres.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "hal_struct_id" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += `${errors
            .map((item) => item?.hal_struct_id || '')
            .join(', ')}.`;
          setMessage(errorMessage);
        } else if (
          data.some((item) => item?.hal_id && !item?.hal_id?.match(halIdRegex))
        ) {
          const errors = data.filter(
            (item) => item?.hal_id && !item?.hal_id?.match(halIdRegex),
          );
          setIsError(true);
          let errorMessage = 'Vos "hal_id" doivent être de la forme "hal-" suivi de chiffres.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "hal_id" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += `${errors
            .map((item) => item?.hal_id || '')
            .join(', ')}.`;
          setMessage(errorMessage);
        } else if (
          data.some(
            (item) => item?.nnt_etab && !item?.nnt_etab?.match(nntEtabRegex),
          )
        ) {
          const errors = data.filter(
            (item) => item?.nnt_etab && !item?.nnt_etab?.match(nntEtabRegex),
          );
          setIsError(true);
          let errorMessage = 'Vos "nnt_etab" doivent être une suite de 4 lettres majuscules optionnellement suivi d\'un chiffre ou d\'une lettre en majuscule.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "nnt_etab" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += ` ${errors
            .map((item) => item?.nnt_etab || '')
            .join(', ')}.`;
          setMessage(errorMessage);
        } else if (
          data.some((item) => item?.nnt_id && !item?.nnt_id?.match(nntIdRegex))
        ) {
          const errors = data.filter(
            (item) => item?.nnt_id && !item?.nnt_id?.match(nntIdRegex),
          );
          setIsError(true);
          let errorMessage = 'Vos "nnt_id" doivent être une année de soutenance suivie de 4 lettres majuscules puis de 4 caractères alphanumériques tel que décrit ';
          errorMessage
            += '<a href="https://documentation.abes.fr/sudoc/regles/Catalogage/Retro_CodeCourt_NNT.htm" target="_blank">sur cette page</a>.';
          errorMessage += ` Vous avez ${
            errors?.length
          } "nnt_id" qui ne respecte${
            errors?.length > 1 ? 'nt' : ''
          } pas cette condition:`;
          errorMessage += ` ${errors
            .map((item) => item?.nnt_id || '')
            .join(', ')}.`;
          setMessage(errorMessage);
        } else {
          setDoiCount(data.filter((item) => item?.doi)?.length);
          setHalCollCode(data.filter((item) => item?.hal_coll_code)?.length);
          setHalId(data.filter((item) => item?.hal_id)?.length);
          setHalStructId(data.filter((item) => item?.hal_struct_id)?.length);
          setNntEtab(data.filter((item) => item?.nnt_etab)?.length);
          setNntId(data.filter((item) => item?.nnt_id)?.length);
        }
      },
      error: () => {
        setIsError(true);
        setMessage(
          "Erreur lors du chargement du fichier. Merci d'en vérifier le format.",
        );
      },
    });
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    if (e.target.files.length !== 1) {
      setIsError(true);
      setMessage('Merci de soumettre un et un seul fichier !');
    } else if (!SUPPORTED_MIME_TYPES.includes(e.target.files?.[0]?.type)) {
      setIsError(true);
      setMessage('Les formats de fichier acceptés sont .csv, .xls ou .xlsx !');
    } else {
      const inputFile = e.target.files[0];
      if (inputFile?.type === 'text/csv') {
        readCSV(inputFile);
      } else {
        const buffer = await inputFile.arrayBuffer();
        const workbook = read(buffer);
        if (workbook.SheetNames.length > 1) {
          setIsError(true);
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
          title={<FormattedMessage id='app.header.nav.a-propos-validation' />}
          icons={renderIcons}
        />
      </div>
      <Container>
        <section className='content bd125 mb-20'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h2 className='marianne-bold fs-12-16'>
                Validation du fichier de DOIs
              </h2>
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <File
                hint='Fichier Excel ou CSV (séparateur point virgule ;). Merci de préciser le nom des colonnes.'
                label='Fichier de DOIs à valider'
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
                || !!halCollCode
                || !!halId
                || !!halStructId
                || !!nntEtab
                || !!nntId) && (
                <div>
                  Ce fichier contient :
                  <ul>
                    {!!doiCount && <li>{`${doiCount} DOI`}</li>}
                    {!!halCollCode && <li>{`${halCollCode} hal_coll_code`}</li>}
                    {!!halId && <li>{`${halId} hal_id`}</li>}
                    {!!halStructId && <li>{`${halStructId} hal_struct_id`}</li>}
                    {!!nntEtab && <li>{`${nntEtab} nnt_etab`}</li>}
                    {!!nntId && <li>{`${nntId} nnt_id`}</li>}
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
}

export default Validation;

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
      complete: (results) => {
        setDoiCount(results.data.filter((item) => item?.doi)?.length);
        setHalCollCode(
          results.data.filter((item) => item?.hal_coll_code)?.length,
        );
        setHalId(results.data.filter((item) => item?.hal_id)?.length);
        setHalStructId(
          results.data.filter((item) => item?.hal_struct_id)?.length,
        );
        setNntEtab(results.data.filter((item) => item?.nnt_etab)?.length);
        setNntId(results.data.filter((item) => item?.nnt_id)?.length);
      },
      error: (err, file, inputElem, reason) => {
        console.log(reason);
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
                  {message}
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

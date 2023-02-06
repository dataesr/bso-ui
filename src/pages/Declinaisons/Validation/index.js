import { Col, Container, File, Icon as DSIcon, Row } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';

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
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState(undefined);

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
        <section className='content bd125'>
          <Row gutters>
            <Col n='12 lg-8'>
              <h2 className='marianne-bold fs-12-16'>
                Validation du fichier de DOIs
              </h2>
              Veuillez soumettre votre fichier ici afin de le valider.
            </Col>
          </Row>
          <Row gutters>
            <Col n='12 lg-8'>
              <File
                hint='Séparator CSV ou xlsx, avec headers'
                label='Fichier de DOIs à valider'
                onChange={async (e) => {
                  setIsError(true);
                  e.preventDefault();
                  if (e.target.files.length !== 1) {
                    setMessage('Merci de soumettre un et un seul fichier !');
                  } else if (
                    !SUPPORTED_MIME_TYPES.includes(e.target.files?.[0]?.type)
                  ) {
                    setMessage(
                      'Les formats de fichier acceptés sont .csv ou .xlsx !',
                    );
                  } else if (e.target.files?.[0].size < 100) {
                    setMessage('Votre fichier semble vide !');
                  } else {
                    setIsError(false);
                    const reader = new FileReader();
                    reader.onload = async (f) => {
                      const text = f.target.result;
                      // TODO: Should display message about number of DOIs, number of Hal...
                      console.log(text);
                      setMessage('Loaded');
                    };
                  }
                }}
              />
              {message && (
                <span className={isError ? 'text-red' : 'text-green'}>
                  {message}
                </span>
              )}
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
}

export default Validation;

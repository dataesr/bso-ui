// import ReactMarkdown from 'react-markdown';
// import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from '@dataesr/react-dsfr';
import { FormattedMessage } from 'react-intl';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Methodologie() {
  // const [markdown, setMarkdown] = useState('');
  /*
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/dataesr/bso-publications/main/doc/bso.md')
      .then((response) => response.text())
      .then((text) => {
        const groups = [...text.matchAll(/# 2\. Method\n\n((.|\n)*)# 3\. Results/gm)];
        let group = groups[0][1];
        group = group.replaceAll('\\newpage', '');
        group = group.replaceAll(/<br \/>/g, '\n&nbsp;');
        group = group.replaceAll(/{ width=\d* }/g, '');
        group = group.replaceAll('## 2.', '## ');
        setMarkdown(group);
      });
  }, []);
  */

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-22'
          color1='blue-soft-125'
          color2='blue-soft-75'
        />
      </Col>
    </Row>
  );
  return (
    <div className='methodologie'>
      <Banner
        backgroundColor='blue-soft-50'
        textColor='blue-dark-150'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.a-propos-methodologie' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row gutters>
            <Col n='12 lg-8'>
              <FormattedMessage id='app.methodo-intro' />
              <br />
              <br />
              {' '}
              <a
                href='https://hal.archives-ouvertes.fr/hal-03651518'
                target='_blank'
                rel='noreferrer'
                className='external_link'
              >
                Extending the open monitoring of open science: A new framework
                for the French Open Science Monitor (BSO)
              </a>
              {' '}
              <br />
              <br />
              <FormattedMessage id='app.methodo-contact' />
              {' '}
              <a href='mailto:bso@recherche.gouv.fr'>bso@recherche.gouv.fr</a>
              .
            </Col>
          </Row>
          {/*
          <Row gutters>
            <Col n='12 lg-8'>
              <ReactMarkdown components={{
                // eslint-disable-next-line jsx-a11y/alt-text, react/prop-types
                img: ({ node, ...props }) => <img style={{ maxWidth: '100%' }} {...props} />,
              }}
              >
                {markdown}
              </ReactMarkdown>
            </Col>
          </Row>
        */}
        </section>
      </Container>
    </div>
  );
}

export default Methodologie;

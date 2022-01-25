import { Col, Container, Row } from '@dataesr/react-dsfr';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';

function Methodologie() {
  const [markdown, setMarkdown] = useState('');

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
              La méthodologie a été mise en place par Anne L'Hôte (MESRI), Eric Jeangirard (MESRI), Didier Torny (CNRS) et Laetitia Bracco
              (Université de Lorraine). La méthodologie est décrite dans le document de travail disponible pour le moment sur
              {' '}
              <a href='https://github.com/dataesr/bso-publications/raw/main/doc/bso.pdf'>github</a>
              {' '}
              et bientôt sur HAL et arXiv. Elle est reproduite ci-dessous (en anglais uniquement pour le moment).
              <br />
              Par ailleurs, pour toute question, vous pouvez nous contacter avec l'adresse bso@recherche.gouv.fr
            </Col>
          </Row>
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
        </section>
      </Container>
    </div>
  );
}

export default Methodologie;

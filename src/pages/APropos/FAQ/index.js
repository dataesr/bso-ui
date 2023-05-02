import {
  Accordion,
  AccordionItem,
  Col,
  Container,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import FaqEntries from '../../../translations/faq.json';

function FAQ() {
  const intl = useIntl();

  const renderItem = (faqKey) => {
    const values = {};

    faqKey?.ctas?.forEach((cta, i) => {
      values[`cta${i}`] = (chunks) => (
        <a
          href={cta}
          target='_blank'
          rel='noreferrer'
          className='external_link'
        >
          {chunks}
        </a>
      );
    });

    return (
      <AccordionItem
        key={uuidv4()}
        title={intl.formatMessage({ id: faqKey.intlEntry })}
      >
        <Container>
          <section className='bg-pink-light-50 px-20 py-28'>
            <Row>
              <Col>
                <FormattedMessage
                  id={faqKey.intlDefinition}
                  values={{
                    cta: (chunks) => (
                      <a
                        target='_blank'
                        href={`${faqKey.cta}`}
                        rel='noreferrer'
                        className='external_link'
                      >
                        {chunks}
                      </a>
                    ),
                    ol: (chunks) => <ol>{chunks}</ol>,
                    p: (chunks) => <p className='fs-16-28'>{chunks}</p>,
                    ul: (chunks) => <ul>{chunks}</ul>,
                    strong: (chunks) => (
                      <strong className='d-block pb-16'>{chunks}</strong>
                    ),
                    li: (chunks) => (
                      <li className='fr-col-offset-1 pb-16'>{chunks}</li>
                    ),
                    ...values,
                  }}
                />
              </Col>
            </Row>
          </section>
        </Container>
      </AccordionItem>
    );
  };

  const renderItems = () => Object.keys(FaqEntries[0]).map((key) => renderItem(FaqEntries[0][key]));

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-31'
          color1='blue-dark-125'
          color2='pink-light-100'
        />
      </Col>
    </Row>
  );

  return (
    <div className='page faq'>
      <Banner
        backgroundColor='pink-light-50'
        textColor='blue-dark-125'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.faq' />}
        icons={renderIcons}
      />
      <Container>
        <section className='content py-48'>
          <Row>
            <Col className='fs-16-28'>
              <Accordion>{renderItems()}</Accordion>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
}

export default FAQ;

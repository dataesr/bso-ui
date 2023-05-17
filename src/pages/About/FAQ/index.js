import {
  Accordion,
  AccordionItem,
  Col,
  Container,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import FaqEntries from '../../../translations/faq.json';

function FAQ() {
  const intl = useIntl();
  const search = new URLSearchParams(useLocation().search);
  const expanded = search?.get('expanded') || 0;

  const renderItem = (faqKey, index) => {
    const values = {};

    faqKey?.ctas?.forEach((cta, i) => {
      values[`cta${i}`] = (chunks) => (
        <a
          className='external_link'
          href={cta}
          rel='noreferrer'
          target='_blank'
        >
          {chunks}
        </a>
      );
    });

    return (
      <AccordionItem
        initExpand={parseInt(index, 10) === parseInt(expanded, 10)}
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
                    li: (chunks) => (
                      <li className='fr-col-offset-1 pb-16'>{chunks}</li>
                    ),
                    ol: (chunks) => <ol>{chunks}</ol>,
                    p: (chunks) => <p className='fs-16-28'>{chunks}</p>,
                    strong: (chunks) => (
                      <strong className='d-block pb-16'>{chunks}</strong>
                    ),
                    ul: (chunks) => <ul className='style-disc'>{chunks}</ul>,
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

  const renderItems = () => Object.keys(FaqEntries).map((key, index) => renderItem(FaqEntries[key], index));

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          color1='blue-dark-125'
          color2='pink-light-100'
          name='icon-bsso-31'
        />
      </Col>
    </Row>
  );

  return (
    <div className='page faq'>
      <Banner
        backgroundColor='pink-light-50'
        icons={renderIcons}
        supTitle={<FormattedMessage id='app.header.title' />}
        textColor='blue-dark-125'
        title={<FormattedMessage id='app.faq' />}
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

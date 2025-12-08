import {
  Accordion,
  AccordionItem,
  Button,
  Col,
  Container,
  Row,
  Select,
} from '@dataesr/react-dsfr';
import classNames from 'classnames';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import GlossaryEntries from '../../../translations/glossary.json';
import { alphabet } from '../../../utils/constants';
import { capitalize, sortByPath } from '../../../utils/helpers';
import useViewport from '../../../utils/Hooks/useViewport';

function Glossary() {
  const intl = useIntl();
  const { mobile } = useViewport();
  const [activeLetter, setActiveLetter] = useState('');
  const [searchParams] = useSearchParams();

  const options = alphabet.map((letter) => ({
    label: letter.toUpperCase(),
    value: letter,
  }));

  options.unshift({
    disabled: false,
    hidden: false,
    label: intl.formatMessage({ id: 'app.glossary.select-letter' }),
    value: '',
  });

  const getItem = (glossaryKey, index) => {
    const values = {};
    glossaryKey?.ctas?.forEach((cta, i) => {
      values[`cta${i}`] = (chunks) => (
        <a href={cta} rel='noreferrer' target='_blank'>
          {chunks}
        </a>
      );
    });

    return (
      <AccordionItem
        initExpand={
          parseInt(index, 10) === parseInt(searchParams.get('expanded'), 10)
        }
        key={uuidv4()}
        title={capitalize(
          intl.formatMessage({
            id: glossaryKey.intlEntry,
          }),
        )}
      >
        <Container>
          <section className='bg-green-soft-25 px-20 py-28'>
            <Row>
              <Col>
                <FormattedMessage
                  id={glossaryKey.intlDefinition}
                  values={{
                    cta: (chunks) => (
                      <a
                        href={`${glossaryKey.cta}`}
                        rel='noreferrer'
                        target='_blank'
                      >
                        {chunks}
                      </a>
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

  const renderItems = () => {
    let r;
    const firstGlossaryEntry = GlossaryEntries[0];
    if (!activeLetter) {
      r = Object.keys(firstGlossaryEntry).map((key, index) => getItem(firstGlossaryEntry[key], index));
    } else {
      r = Object.keys(firstGlossaryEntry).map((key) => {
        const firstLetterEntry = intl.formatMessage({
          id: firstGlossaryEntry[key].intlEntry,
        })[0];
        return activeLetter && firstLetterEntry.toLowerCase() === activeLetter
          ? getItem(firstGlossaryEntry[key])
          : null;
      });
    }
    return sortByPath(r, 'props.title');
  };

  const renderIcons = (
    <Row justifyContent='center' alignItems='middle' gutters>
      <Col n='12'>
        <Icon
          name='icon-bsso-29'
          color1='blue-dark-125'
          color2='green-soft-75'
        />
      </Col>
    </Row>
  );

  return (
    <section className='page bso-glossaire'>
      <Banner
        backgroundColor='green-soft-25'
        textColor='blue-dark-125'
        supTitle={<FormattedMessage id='app.header.title' />}
        title={<FormattedMessage id='app.header.nav.about.glossary' />}
        icons={renderIcons}
      >
        <section className='text-center text-left-m fs-16-24'>
          {!mobile && (
            <ul className='m-0'>
              {alphabet.map((letter) => (
                <li
                  key={uuidv4()}
                  className={`${
                    letter === activeLetter ? 'marianne-extra-bold' : ''
                  } mx-5 d-inline`}
                >
                  <Button
                    className={classNames(
                      'text-upper fs-16-24 btn-transparent',
                      {
                        active: letter === activeLetter,
                      },
                    )}
                    styleAsLink
                    size='sm'
                    onClick={(e) => {
                      if (e.target.innerHTML === activeLetter) {
                        setActiveLetter('');
                      } else {
                        setActiveLetter(e.target.innerHTML);
                      }
                    }}
                    title={letter}
                  >
                    {letter}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {mobile && (
            <Select
              onChange={(e) => {
                setActiveLetter(e.target.value);
              }}
              selected={activeLetter}
              options={options}
            />
          )}
        </section>
      </Banner>
      <Container>
        <section className='content py-48'>
          <Row>
            <Col>
              <Accordion>{renderItems()}</Accordion>
            </Col>
          </Row>
        </section>
      </Container>
    </section>
  );
}

export default Glossary;

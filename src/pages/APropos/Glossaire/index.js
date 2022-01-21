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
import { v4 as uuidv4 } from 'uuid';

import Banner from '../../../components/Banner';
import Icon from '../../../components/Icon';
import GlossaryEntries from '../../../translations/glossary.json';
import { alphabet } from '../../../utils/constants';
import { capitalize, sortByPath } from '../../../utils/helpers';
import useViewport from '../../../utils/Hooks/useViewport';

function Glossaire() {
  const intl = useIntl();
  const { mobile } = useViewport();
  const [activeLetter, setActiveLetter] = useState('');

  const options = alphabet.map((letter) => ({
    label: letter.toUpperCase(),
    value: letter,
  }));
  options.unshift({
    value: '',
    label: intl.formatMessage({ id: 'app.glossary.select-letter' }),
    disabled: false,
    hidden: false,
  });
  const getItem = (glossaryKey) => (
    <AccordionItem
      key={uuidv4()}
      title={capitalize(
        intl.formatMessage({
          id: glossaryKey.intlEntry,
        }),
      )}
    >
      <Container>
        <section className='px-20 py-28 bg-soft-green'>
          <Row>
            <Col>
              <FormattedMessage id={glossaryKey.intlDefinition} />
            </Col>
          </Row>
        </section>
      </Container>
    </AccordionItem>
  );

  const renderItems = () => {
    let r;
    const firstGlossaryEntry = GlossaryEntries[0];
    if (!activeLetter) {
      r = Object.keys(firstGlossaryEntry).map((key) => getItem(firstGlossaryEntry[key]));
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
        title={<FormattedMessage id='app.header.nav.a-propos-glossaire' />}
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
                  } my-5 d-inline`}
                >
                  <Button
                    className={classNames('text-upper fs-16-24', {
                      active: letter === activeLetter,
                    })}
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

export default Glossaire;

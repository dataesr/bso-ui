import {
  Button,
  Col,
  Container,
  Icon as DSIcon,
  Link as DSLink,
  Row,
} from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import GlossaryItem from './GlossaryItem';

function Glossary({ entries }) {
  const intl = useIntl();
  const contentRef = useRef();
  const [openPanel, setOpenPanel] = useState(false);
  const [glossaryEntries, setGlossaryEntries] = useState([]);
  const [activeKey, setActiveKey] = useState('');

  const activeClassManage = useCallback((glossaryKey = '', action) => {
    if (glossaryKey) {
      const activeClassObj = {
        remove: (elm) => elm.classList.remove('active'),
        add: (elm) => elm.classList.add('active'),
      };
      const glossaryKeyElement = document.querySelector(
        `[data-glossary-key=${glossaryKey}]`,
      );
      activeClassObj[action](glossaryKeyElement);
    }
  }, []);

  const glossaryPanel = useCallback(
    (key, open) => {
      activeClassManage(activeKey, 'remove');
      setActiveKey(key);
      setOpenPanel(open);
    },
    [activeKey, setActiveKey, setOpenPanel, activeClassManage],
  );

  const onClickEntry = useCallback(
    (glossaryKey) => {
      glossaryPanel(glossaryKey, true);
      activeClassManage(glossaryKey, 'add');

      const glossaryEntry = document.querySelector(
        `[data-glossary-entry='${glossaryKey}']`,
      );

      if (glossaryEntry && contentRef.current) {
        contentRef.current.scrollTop = glossaryEntry.offsetTop - 15;
      }
    },
    [glossaryPanel, activeClassManage],
  );

  useEffect(() => {
    if (glossaryEntries.length > 0) {
      for (let i = 0; i < glossaryEntries.length; i += 1) {
        glossaryEntries[i].addEventListener('click', (e) => {
          onClickEntry(e.target.dataset.glossaryKey);
        });
      }
    }
  }, [onClickEntry, glossaryEntries]);

  useEffect(() => {
    const arrGlossayEntries = Array.from(document.querySelectorAll('.glossary-entry'));
    if (glossaryEntries.length === 0 && arrGlossayEntries.length > 0) {
      setGlossaryEntries(arrGlossayEntries);
    }
  }, [glossaryEntries]);

  useEffect(() => {
    document.body.style.overflow = openPanel ? 'hidden' : null;
  }, [openPanel]);

  return (
    <section className={classNames('bso-glossary z-3000', { openPanel })}>
      <Container>
        <DSIcon name='ri-information-fill' size='1x' iconPosition='right'>
          <Button
            size='sm'
            onClick={() => glossaryPanel('', !openPanel)}
            className='btn-blue text-white'
          >
            <FormattedMessage id='app.glossary' defaultMessage='Glossaire' />
          </Button>
        </DSIcon>
        <Row>
          <Col n='12' className='wrapper-title'>
            <Row>
              <Col n='9'>
                <div className='fs-20-20 marianne-extra-bold'>
                  <FormattedMessage
                    id='app.glossary.title'
                    defaultMessage='Glossaire de la page'
                  />
                </div>
              </Col>
              <Col n='3' className='text-right'>
                <button
                  className='close'
                  type='button'
                  onClick={() => glossaryPanel('', false)}
                >
                  <DSIcon
                    className='ds-fr--v-middle'
                    name='ri-close-circle-line'
                    size='lg'
                    iconPosition='right'
                  >
                    <span>
                      <FormattedMessage id='app.commons.fermer' />
                    </span>
                  </DSIcon>
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col n='12'>
            <div ref={contentRef} className='content relative'>
              {glossaryEntries
                && glossaryEntries.map((entry, i) => {
                  const key = entry.getAttribute('data-glossary-key');
                  const currentEntry = entries[0][key];
                  return (
                    <GlossaryItem
                      glossaryKey={key}
                      key={uuidv4()}
                      intlDefinition={currentEntry.intlDefinition}
                      active={key === activeKey}
                      intlEntry={currentEntry.intlEntry}
                      className={i === 0 ? 'pt-20' : ''}
                      link={currentEntry.cta || null}
                    />
                  );
                })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col n='12'>
            <DSLink
              className='to-glossary-page'
              icon='ri-arrow-right-line'
              iconSize='lg'
              as={<Link to='/a-propos/glossaire' />}
            >
              {intl.formatMessage({
                id: 'app.glossary.complete',
                defaultMessage:
                  'Toutes les définitions dans le glossaire complet',
              })}
            </DSLink>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

Glossary.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default Glossary;

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
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import useLang from '../../utils/Hooks/useLang';
import GlossaryItem from './GlossaryItem';

function Glossary({ entries }) {
  const intl = useIntl();
  const contentRef = useRef();
  const { lang } = useLang();
  const [openPanel, setOpenPanel] = useState(false);
  const [glossaryEntries, setGlossaryEntries] = useState([]);
  const [activeKey, setActiveKey] = useState('');

  const activeClassManage = useCallback((glossaryKey = '', action) => {
    if (glossaryKey) {
      const activeClassObj = {
        remove: (elm) => elm.classList.remove('active'),
        add: (elm) => elm.classList.add('active'),
      };
      const x = document.querySelector(`[data-glossary-key=${glossaryKey}]`);
      activeClassObj[action](x);
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

  const onClickWord = useCallback(
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
          onClickWord(e.target.dataset.glossaryKey);
        });
      }
    }
  }, [onClickWord, glossaryEntries]);

  useEffect(() => {
    if (glossaryEntries.length === 0) {
      setGlossaryEntries(
        Array.from(document.querySelectorAll('.glossary-entry')),
      );
    }
  }, [glossaryEntries, setGlossaryEntries]);

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
            className='blue'
          >
            {intl.formatMessage({
              id: 'app.glossary',
              defaultMessage: 'Glossaire',
            })}
          </Button>
        </DSIcon>
        <Row>
          <Col n='12' className='wrapper-title'>
            <Row>
              <Col n='9'>
                <div className='fs-20-20 marianne-extra-bold'>
                  {intl.formatMessage({
                    id: 'app.glossary.title',
                    defaultMessage: 'Glossaire de la page',
                  })}
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
                    <span>Fermer</span>
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
                  return (
                    <GlossaryItem
                      glossaryKey={key}
                      key={uuidv4()}
                      definition={entries[0][key].definition[lang]}
                      active={key === activeKey}
                      entry={entries[0][key].entry[lang]}
                      className={i === 0 ? 'pt-20' : ''}
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
              Toutes les définitions dans le glossaire complet
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

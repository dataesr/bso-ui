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
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import GlossaryItem from './GlossaryItem';

function Glossary({ words }) {
  const [open, setOpen] = useState(false);
  const [glossaryWords, setGlossaryWords] = useState([]);
  const [active, setActive] = useState('');
  const itemRefs = useRef([]);

  const onClickWord = useCallback(
    (glossaryKey) => {
      const content = document.querySelector('.content');
      setOpen(true);
      setActive(glossaryKey);
      const elm = document.querySelector(
        `[data-glossary-word='${glossaryKey}']`,
      );
      if (elm) {
        content.scrollTop = elm.offsetTop - 10;
      }
    },
    [setOpen, setActive],
  );

  useEffect(() => {
    if (glossaryWords.length > 0) {
      itemRefs.current = glossaryWords.map(
        (_, i) => itemRefs.current[i] ?? React.createRef(),
      );

      for (let i = 0; i < glossaryWords.length; i += 1) {
        glossaryWords[i].addEventListener('click', (e) => {
          onClickWord(e.target.dataset.glossaryKey);
        });
      }
    }
  }, [onClickWord, setOpen, glossaryWords]);

  useEffect(() => {
    if (glossaryWords.length === 0) {
      setGlossaryWords(Array.from(document.querySelectorAll('.glossary-word')));
    }
  }, [glossaryWords, setGlossaryWords]);

  useEffect(() => {
    const content = document.querySelector('.content');
    document.body.style.overflow = open ? 'hidden' : null;
    if (!open) {
      content.scrollTop = 0;
    }
  }, [open]);

  return (
    <section className={classNames('bso-glossary z-3000', { open })}>
      <Container>
        <DSIcon name='ri-information-fill' size='1x' iconPosition='right'>
          <Button
            size='sm'
            onClick={() => {
              setActive('');
              setOpen(!open);
            }}
          >
            Glossaire
          </Button>
        </DSIcon>
        <Row>
          <Col n='12' className='wrapper-title'>
            <Row>
              <Col n='9'>
                <div className='fs-20-20 marianne-extra-bold'>
                  Glossaire de la page
                </div>
              </Col>
              <Col n='3' className='text-right'>
                <button
                  className='close'
                  type='button'
                  onClick={() => setOpen(false)}
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
        <Row className='content relative'>
          <Col n='12'>
            {words
              && Object.keys(words[0]).map((key, i) => (
                <GlossaryItem
                  glossaryKey={key}
                  key={uuidv4()}
                  ref={itemRefs.current[i]}
                  definition={words[0][key].fr}
                  active={key === active}
                  word={words[0][key].word}
                  index={i}
                />
              ))}
          </Col>
        </Row>
        <Row>
          <Col n='12'>
            <DSLink
              className='to-glossary-page'
              icon='ri-arrow-right-line'
              iconSize='lg'
              as={(
                <Link to='/a-propos/glossaire'>
                  Toutes les définitions dans le glossaire complet
                </Link>
              )}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

Glossary.propTypes = {
  words: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default Glossary;

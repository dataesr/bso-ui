/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

// TODO:
// Cette page est juste une page d'aide à la saisie des traductions. Elle sera supprimée lors de la mise en PROD
// localhost:3000/translations

import {
  Button,
  Col,
  Container,
  Modal,
  ModalClose,
  ModalContent,
  Row,
} from '@dataesr/react-dsfr';
import React, { useEffect, useState } from 'react';

import En from './en.json';
import Fr from './fr.json';

const TranslationsPage = () => {
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generation, setGeneration] = useState('');

  useEffect(() => {
    const arrayFr = [];
    const arrayEn = [];

    for (const key in Fr) {
      arrayFr.push(key);
      arrayFr[key] = Fr[key];
    }

    for (const key in En) {
      arrayEn.push(key);
      arrayEn[key] = En[key];
    }

    const newData = {};
    arrayFr.forEach((key) => {
      newData[key] = {
        fr: arrayFr[key],
        en: arrayEn[key] || '',
      };
    });

    setData(newData);
  }, []);

  const generate = (lang) => {
    const ret = Object.keys(data).map((key, i) => (
      <div>
        {`"${key}": "${data[key][lang]}"${
          i + 1 === Object.keys(data).length ? '' : ','
        }`}
      </div>
    ));

    setGeneration(ret);
    setIsModalOpen(true);
  };

  const saveData = (key, value, lang) => {
    const newData = { ...data };
    newData[key][lang] = value;
    setData(newData);
  };

  if (!data || data === {}) {
    return null;
  }

  return (
    <>
      <Container>
        <Row>
          <Col n='2'>
            <Button onClick={() => generate('fr')}>Générer FR</Button>
          </Col>
          <Col n='2'>
            <Button onClick={() => generate('en')}>Générer EN</Button>
          </Col>
        </Row>
        {Object.keys(data).map((key) => (
          <React.Fragment key={key}>
            <Row>
              <Col>
                <strong>{key}</strong>
              </Col>
            </Row>
            <Row>
              <Col n='1'>FR</Col>
              <Col>
                <textarea
                  style={{ width: '800px', height: '50px' }}
                  id={`${key}_fr`}
                  value={data[key].fr}
                  onChange={(e) => saveData(key, e.target.value, 'fr')}
                />
              </Col>
            </Row>
            <Row>
              <Col n='1'>EN</Col>
              <Col>
                <textarea
                  style={{ width: '800px', height: '50px' }}
                  id={`${key}_en`}
                  value={data[key].en}
                  onChange={(e) => saveData(key, e.target.value, 'en')}
                />
              </Col>
            </Row>
          </React.Fragment>
        ))}
      </Container>
      <Modal
        size='lg'
        isOpen={isModalOpen}
        hide={() => {
          setIsModalOpen(false);
        }}
      >
        <ModalClose
          hide={() => {
            setIsModalOpen(false);
          }}
          title='Fermer'
        >
          Fermer
        </ModalClose>
        <ModalContent>
          &#123;
          {generation}
          &#125;
        </ModalContent>
      </Modal>
    </>
  );
};

export default TranslationsPage;

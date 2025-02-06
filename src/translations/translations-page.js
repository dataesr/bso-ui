/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

// This page is for translations purpose.
// It is only available in localhost via :
// http://localhost:3000/translations or http://127.0.0.1:3000/translations

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
import Ja from './ja.json';

const TranslationsPage = () => {
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generation, setGeneration] = useState('');

  useEffect(() => {
    const arrayEn = [];
    const arrayJa = [];

    for (const key in En) {
      arrayEn.push(key);
      arrayEn[key] = En[key];
    }

    for (const key in Ja) {
      arrayJa.push(key);
      arrayJa[key] = Ja[key];
    }

    const newData = {};
    arrayEn.forEach((key) => {
      newData[key] = {
        en: arrayEn[key],
        ja: arrayJa[key] || '',
      };
    });

    setData(newData);
  }, []);

  const generate = (lang) => {
    const generated = Object.keys(data).map((key, i) => {
      const value = data[key][lang].replaceAll('"', '\\"');
      return (
        <div>
          {`"${key}": "${value}"${
            i + 1 === Object.keys(data).length ? '' : ','
          }`}
        </div>
      );
    });
    setGeneration(generated);
    setIsModalOpen(true);
  };

  const saveData = (key, value, lang) => {
    const newData = { ...data };
    newData[key][lang] = value;
    setData(newData);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <Container>
        <Row>
          <Col n='2'>
            <Button onClick={() => generate('en')}>Générer EN</Button>
          </Col>
          <Col n='2'>
            <Button onClick={() => generate('ja')}>Générer JA</Button>
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
            <Row>
              <Col n='1'>JA</Col>
              <Col>
                <textarea
                  style={{ width: '800px', height: '50px' }}
                  id={`${key}_ja`}
                  value={data[key].ja}
                  onChange={(e) => saveData(key, e.target.value, 'ja')}
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

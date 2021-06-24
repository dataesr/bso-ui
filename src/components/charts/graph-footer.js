/* eslint-disable jsx-a11y/control-has-associated-label */
import './graph.scss';

import {
  Col,
  Container,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  Row,
  Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const GraphFooter = ({
  source,
  date,
  graphId,
  onCsvButtonClick,
  onPngButtonClick,
}) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className='graph-footer'>
        <Container>
          <Row>
            <Col>
              {date ? (
                <Text size='xs'>{`Données mise à jour le ${date}`}</Text>
              ) : null}
              {date && source ? <hr /> : null}
              {source ? (
                <Text size='xs' className='source'>
                  {`Source : ${source}`}
                </Text>
              ) : null}
              {source && graphId ? <hr /> : null}
              <p>
                <Text size='xs' as='span' className='download'>
                  <FormattedMessage
                    id='app.graph.download'
                    defaultMessage='Télécharger'
                  />
                </Text>
                <i
                  className='ri-file-excel-fill icon-click'
                  onClick={() => onCsvButtonClick()}
                  onKeyPress={() => onCsvButtonClick()}
                  role='button'
                  tabIndex={0}
                />
                <i
                  className='ri-file-chart-fill icon-click'
                  onClick={() => onPngButtonClick()}
                  onKeyPress={() => onPngButtonClick()}
                  role='button'
                  tabIndex={0}
                />
                {graphId ? (
                  <>
                    <Text size='xs' as='span' className='integration'>
                      <FormattedMessage
                        id='app.graph.integration'
                        defaultMessage='Intégrer le graphique'
                      />
                    </Text>
                    <i
                      className='ri-file-code-fill icon-click'
                      onClick={() => setIsModalOpen(!isModalOpen)}
                      onKeyPress={() => setIsModalOpen(!isModalOpen)}
                      role='button'
                      tabIndex={0}
                    />
                  </>
                ) : null}
              </p>
            </Col>
          </Row>
        </Container>
        <Container fluid className='share'>
          <Row>
            <Col className='text-right'>
              <Text size='xs' as='span' className='text'>
                <FormattedMessage
                  id='app.graph.share'
                  defaultMessage='Partager ce graphique'
                />
              </Text>

              <i className='ri-twitter-fill' />
              <i className='ri-linkedin-box-fill' />
              <i className='ri-facebook-box-fill' />
            </Col>
          </Row>
        </Container>
      </div>
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
          title={intl.formatMessage({
            id: 'app.commons.modal.fermer',
            defaultMessage: 'Fermer la fenêtre modale',
          })}
        >
          <FormattedMessage id='app.commons.fermer' defaultMessage='fermer' />
        </ModalClose>
        <ModalTitle>
          <FormattedMessage
            id='app.graph.integration'
            defaultMessage='Intégrer le graphique'
          />
        </ModalTitle>
        <ModalContent>
          &#60;iframe
          <br />
          <span style={{ paddingLeft: '18px' }} />
          id='yourID'
          <br />
          <span style={{ paddingLeft: '18px' }} />
          width='800'
          <br />
          <span style={{ paddingLeft: '18px' }} />
          height='600'
          <br />
          <span style={{ paddingLeft: '18px' }} />
          src=
          {`/integration/${graphId}`}
          /&#62;
        </ModalContent>
      </Modal>
    </>
  );
};

export default GraphFooter;

GraphFooter.defaultProps = {
  source: '',
  date: '',
  graphId: '',
  onCsvButtonClick: null,
  onPngButtonClick: null,
};
GraphFooter.propTypes = {
  source: PropTypes.string,
  date: PropTypes.string,
  graphId: PropTypes.string, // pour lien intégration
  onCsvButtonClick: PropTypes.func,
  onPngButtonClick: PropTypes.func,
};

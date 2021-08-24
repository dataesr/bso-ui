/* eslint-disable jsx-a11y/control-has-associated-label */
import './graph.scss';

import {
  Button as DSButton,
  Col,
  Container,
  Icon as DSIcon,
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
                <Text size='xs'>
                  <FormattedMessage
                    id='app.graph.data-updated'
                    defaultMessage='Data updated'
                  />
                  {` ${date}`}
                </Text>
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
                <span
                  className='icon-click'
                  tabIndex={0}
                  role='button'
                  onClick={() => onCsvButtonClick()}
                  onKeyPress={() => onCsvButtonClick()}
                >
                  <DSIcon
                    name='ri-file-excel-fill'
                    size='lg'
                    as='span'
                    iconPosition='right'
                    className='ds-fr--v-middle'
                  >
                    <Text size='xs' as='span' className='download'>
                      <FormattedMessage
                        id='app.graph.download.csv'
                        defaultMessage='csv'
                      />
                    </Text>
                  </DSIcon>
                </span>
                <span
                  className='icon-click'
                  tabIndex={0}
                  role='button'
                  onClick={() => onPngButtonClick()}
                  onKeyPress={() => onPngButtonClick()}
                >
                  <DSIcon
                    name='ri-file-chart-fill '
                    size='lg'
                    as='span'
                    iconPosition='right'
                    className='ds-fr--v-middle icon-click'
                  >
                    <Text size='xs' as='span' className='download'>
                      <FormattedMessage
                        id='app.graph.download.png'
                        defaultMessage='png'
                      />
                    </Text>
                  </DSIcon>
                </span>
                {graphId ? (
                  <span
                    className='icon-click'
                    tabIndex={0}
                    role='button'
                    onClick={() => setIsModalOpen(!isModalOpen)}
                    onKeyPress={() => setIsModalOpen(!isModalOpen)}
                  >
                    <DSIcon
                      name='ri-file-code-fill'
                      size='lg'
                      as='span'
                      iconPosition='right'
                      className='ds-fr--v-middle icon-click'
                    >
                      <Text size='xs' as='span' className=''>
                        <FormattedMessage
                          id='app.graph.integration'
                          defaultMessage='Intégrer le graphique'
                        />
                      </Text>
                    </DSIcon>
                  </span>
                ) : null}
              </p>
            </Col>
          </Row>
        </Container>
        <Container fluid className='share'>
          <Row>
            <Col className='text-right'>
              <div className='flex flex-end align-center'>
                <div className='fs-14-24 marianne'>
                  <FormattedMessage
                    id='app.graph.share'
                    defaultMessage='Partager ce graphique'
                  />
                </div>
                <DSButton
                  title='twitter'
                  icon='ri-twitter-fill'
                  size='sm'
                  className='bg-medium-blue'
                />
                <DSButton
                  title='linkedin'
                  icon='ri-linkedin-box-fill'
                  size='sm'
                  className='bg-medium-blue'
                />
                <DSButton
                  title='facebook'
                  icon='ri-facebook-box-fill'
                  size='sm'
                  className='bg-medium-blue'
                />
              </div>
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

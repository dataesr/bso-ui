import {
  Button,
  Col,
  Container,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  Row,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const GraphFooter = ({
  source,
  date,
  graphId,
  // onCsvButtonClick,
  // onXlsButtonClick,
  // onPngButtonClick,
}) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shareButtonRef = useRef();
  return (
    <>
      <div style={{ backgroundColor: '#EDEDF2' }}>
        <Container>
          {date ? `Données mise à jour le ${date}` : null}
          {date && source ? <hr /> : null}
          {source ? `Source : ${source}` : null}
          {source && graphId ? <hr /> : null}
          {graphId ? (
            <Button
              ref={shareButtonRef}
              icon='ri-file-code-fill'
              styleAsLink
              size='sm'
              iconPosition='right'
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <FormattedMessage
                id='app.graph.integration'
                defaultMessage='Intégrer le graphique'
              />
            </Button>
          ) : null}
        </Container>
        <Container
          fluid
          style={{ backgroundColor: '#5770BE' }}
          className='px-24'
        >
          <Row justifyContent='end'>
            <Col className='text-right'>
              <FormattedMessage
                id='app.graph.share'
                defaultMessage='Partager ce graphique'
              />
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
  // onCsvButtonClick: null,
  // onXlsButtonClick: null,
  // onPngButtonClick: null,
};
GraphFooter.propTypes = {
  source: PropTypes.string,
  date: PropTypes.string,
  graphId: PropTypes.string, // pour lien intégration
  // onCsvButtonClick: PropTypes.func,
  // onXlsButtonClick: PropTypes.func,
  // onPngButtonClick: PropTypes.func,
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import './graph.scss';

import {
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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

import { studiesTypes } from '../../utils/constants';
import { getCSSValue } from '../../utils/helpers';

const GraphFooter = ({
  source,
  date,
  title,
  srcPath,
  studyType,
  onCsvButtonClick,
  onPngButtonClick,
}) => {
  const intl = useIntl();
  const { search } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const urlSearchParams = new URLSearchParams(search);
  urlSearchParams.delete('id');
  const urlToShare = `${window.location.origin}/integration/${
    intl.locale
  }/${srcPath}${studyType ? '/' : ''}${studyType}${
    urlSearchParams ? '?' : ''
  }${urlSearchParams}`;
  const shareFill = getCSSValue('--blue-soft-100');
  const clipboardContent = `<iframe id="yourID" width="800" height="600" src=${urlToShare} />`;

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
              {source && srcPath ? <hr /> : null}
              <p>
                <Text size='xs' as='span' className='download'>
                  <FormattedMessage
                    id='app.graph.download'
                    defaultMessage='Télécharger'
                  />
                </Text>
                {onCsvButtonClick && (
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
                          defaultMessage='CSV'
                        />
                      </Text>
                    </DSIcon>
                  </span>
                )}
                {onPngButtonClick && (
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
                          defaultMessage='PNG'
                        />
                      </Text>
                    </DSIcon>
                  </span>
                )}
                {srcPath ? (
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
                          defaultMessage='Intégration'
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
                    defaultMessage='Partager'
                  />
                </div>
                <TwitterShareButton
                  title={title}
                  url={urlToShare}
                  text={title}
                  hashtags={['OpenAccess,ScienceOuverte', 'dataESR']}
                  related={['sup_recherche', 'ouvrirlascience']}
                  via='ouvrirlascience'
                  className='share-btn'
                >
                  <TwitterIcon size={30} bgStyle={{ fill: shareFill }} />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={urlToShare}
                  title={title}
                  className='share-btn'
                >
                  <LinkedinIcon size={30} bgStyle={{ fill: shareFill }} />
                </LinkedinShareButton>
                <FacebookShareButton
                  className='share-btn'
                  quote={title}
                  url={urlToShare}
                  hashtag='ScienceOuverte'
                >
                  <FacebookIcon size={30} bgStyle={{ fill: shareFill }} />
                </FacebookShareButton>
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
        className='graph-integration'
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
          <Container>
            <Row>
              <Col>
                <FormattedMessage id='app.graph.integration' />
              </Col>
              <Col className='text-right'>
                <CopyToClipboard text={clipboardContent}>
                  <i className='ri-clipboard-line bt-copy' />
                </CopyToClipboard>
              </Col>
            </Row>
          </Container>
        </ModalTitle>
        <ModalContent>
          <p className='code'>
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
            src='
            {urlToShare}
            '&nbsp;/&#62;
          </p>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GraphFooter;

GraphFooter.defaultProps = {
  source: '',
  date: '',
  title: '',
  srcPath: '',
  onCsvButtonClick: null,
  onPngButtonClick: null,
  studyType: null,
};
GraphFooter.propTypes = {
  source: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  srcPath: PropTypes.string, // pour lien intégration
  onCsvButtonClick: PropTypes.func,
  onPngButtonClick: PropTypes.func,
  studyType: PropTypes.oneOf(studiesTypes),
};

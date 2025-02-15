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
  TwitterShareButton,
  XIcon,
} from 'react-share';

import { studiesTypes } from '../../utils/constants';
import { getCSSValue } from '../../utils/helpers';
import FullScreen from '../FullScreen';

const GraphFooter = ({
  date,
  enableExport,
  height,
  onCsvButtonClick,
  onPngButtonClick,
  source,
  srcPath,
  studyType,
  title,
}) => {
  const intl = useIntl();
  const { search } = useLocation();
  const [isModalIntegrationOpen, setIsModalIntegrationOpen] = useState(false);
  const [isModalFullscreenOpen, setIsModalFullscreenOpen] = useState(false);
  const urlSearchParams = new URLSearchParams(search);
  urlSearchParams.delete('id');
  const urlToShare = encodeURI(
    `${window.location.origin}/integration/${intl.locale}/${srcPath}${
      studyType ? '/' : ''
    }${studyType}${
      Array.from(urlSearchParams).length ? '?' : ''
    }${urlSearchParams}`,
  );

  const clipboardContent = `<iframe id="${srcPath}" title="${title}" width="800" height="${height}" src="${urlToShare}"></iframe>`;

  return (
    <>
      <div className='graph-footer'>
        <Container>
          <Row>
            <Col className='graph-footer__content'>
              {date ? (
                <div className='graph-footer__field'>
                  <span className='graph-footer__field-label'>
                    <FormattedMessage
                      id='app.graph.data-updated'
                      defaultMessage='Data updated'
                    />
                  </span>
                  <span className='graph-footer__field-value'>{date}</span>
                </div>
              ) : null}
              {source ? (
                <div className='graph-footer__field'>
                  <span className='graph-footer__field-label'>Sources</span>
                  <span className='graph-footer__field-value'>{source}</span>
                </div>
              ) : null}
              <div className='graph-footer__field-wrapper'>
                {enableExport && (
                  <div className='graph-footer__field'>
                    <span className='graph-footer__field-label'>
                      <FormattedMessage
                        id='app.graph.download'
                        defaultMessage='Download'
                      />
                    </span>
                    <span className='graph-footer__field-value graph-footer__dl-btn'>
                      {onCsvButtonClick && (
                        <button
                          className='josm-btn'
                          type='button'
                          onClick={() => onCsvButtonClick()}
                          onKeyPress={() => onCsvButtonClick()}
                        >
                          <FormattedMessage
                            id='app.graph.download.csv'
                            defaultMessage='CSV'
                          />
                        </button>
                      )}
                      {onPngButtonClick && (
                        <button
                          className='josm-btn'
                          type='button'
                          onClick={() => onPngButtonClick()}
                          onKeyPress={() => onPngButtonClick()}
                        >
                          <FormattedMessage
                            id='app.graph.download.png'
                            defaultMessage='PNG'
                          />
                        </button>
                      )}
                    </span>
                  </div>
                )}
                {enableExport && srcPath && (
                  <span className='graph-footer__separator' />
                )}
                {srcPath && (
                  <div className='graph-footer__field-value'>
                    <button
                      className='josm-btn'
                      type='button'
                      onClick={() => setIsModalIntegrationOpen(!isModalIntegrationOpen)}
                      onKeyPress={() => setIsModalIntegrationOpen(!isModalIntegrationOpen)}
                    >
                      <FormattedMessage
                        id='app.graph.integration'
                        defaultMessage='Integration'
                      />
                    </button>
                    <button
                      className='josm-btn'
                      type='button'
                      onClick={() => setIsModalFullscreenOpen(!isModalFullscreenOpen)}
                      onKeyPress={() => setIsModalFullscreenOpen(!isModalFullscreenOpen)}
                    >
                      <FormattedMessage
                        id='app.graph.fullscreen'
                        defaultMessage='Plein écran'
                      />
                    </button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid className='share'>
          <Row>
            <Col>
              <div className='share-container'>
                <div className='share-label'>
                  <FormattedMessage
                    defaultMessage='Share'
                    id='app.graph.share'
                  />
                </div>
                <div className='share-buttons'>
                  <TwitterShareButton
                    className='share-btn'
                    hashtags={['OpenAccess', 'ScienceOuverte', 'dataESR']}
                    related={['sup_recherche', 'ouvrirlascience']}
                    text={title}
                    title={title}
                    url={urlToShare}
                    via='ouvrirlascience'
                    style={{ borderRadius: 16, border: 'solid 1px #333' }}
                  >
                    <XIcon
                      size={32}
                      iconFillColor='#333'
                      bgStyle={{ fill: 'transparent' }}
                    />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    className='share-btn'
                    source='BSO'
                    summary={title}
                    title={title}
                    url={urlToShare}
                    style={{ borderRadius: 16, border: 'solid 1px #333' }}
                  >
                    <LinkedinIcon
                      size={32}
                      iconFillColor='#333'
                      bgStyle={{ fill: 'transparent' }}
                    />
                  </LinkedinShareButton>
                  <FacebookShareButton
                    className='share-btn'
                    hashtag='ScienceOuverte'
                    quote={title}
                    url={urlToShare}
                    style={{ borderRadius: 16, border: 'solid 1px #333' }}
                  >
                    <FacebookIcon
                      size={32}
                      iconFillColor='#333'
                      bgStyle={{ fill: 'transparent' }}
                    />
                  </FacebookShareButton>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal
        className='graph-integration'
        hide={() => {
          setIsModalIntegrationOpen(false);
        }}
        isOpen={isModalIntegrationOpen}
        size='lg'
      >
        <ModalClose
          hide={() => {
            setIsModalIntegrationOpen(false);
          }}
          title={intl.formatMessage({
            defaultMessage: 'Close modal',
            id: 'app.commons.modal.close',
          })}
        >
          <FormattedMessage id='app.commons.close' defaultMessage='Close' />
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
            &lt;iframe
            <br />
            <span style={{ paddingLeft: '18px' }} />
            id="
            {srcPath}
            "
            <br />
            <span style={{ paddingLeft: '18px' }} />
            title="
            {title}
            "
            <br />
            <span style={{ paddingLeft: '18px' }} />
            width="800"
            <br />
            <span style={{ paddingLeft: '18px' }} />
            height="
            {height}
            "
            <br />
            <span style={{ paddingLeft: '18px' }} />
            src="
            {urlToShare}
            "&gt;&lt;/iframe&gt;
          </p>
        </ModalContent>
      </Modal>
      <Modal
        className='graph-fullscreen'
        hide={() => setIsModalFullscreenOpen(false)}
        isOpen={isModalFullscreenOpen}
        size='lg'
        style={{ with: '100%' }}
      >
        <ModalClose
          hide={() => setIsModalFullscreenOpen(false)}
          title={intl.formatMessage({
            defaultMessage: 'Close modal',
            id: 'app.commons.modal.close',
          })}
        >
          <FormattedMessage id='app.commons.close' defaultMessage='Close' />
        </ModalClose>
        <ModalContent>
          <FullScreen domain='' graphId={srcPath} studyType={studyType} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default GraphFooter;

GraphFooter.defaultProps = {
  date: '',
  enableExport: true,
  height: 600,
  onCsvButtonClick: null,
  onPngButtonClick: null,
  source: '',
  srcPath: '',
  studyType: null,
  title: '',
};
GraphFooter.propTypes = {
  date: PropTypes.string,
  enableExport: PropTypes.bool,
  height: PropTypes.number,
  onCsvButtonClick: PropTypes.func,
  onPngButtonClick: PropTypes.func,
  source: PropTypes.string,
  srcPath: PropTypes.string, // pour lien intégration
  studyType: PropTypes.oneOf(studiesTypes),
  title: PropTypes.string,
};

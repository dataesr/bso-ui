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

const GraphFooter = ({
  date,
  enableExport,
  fullscreen,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const urlSearchParams = new URLSearchParams(search);
  urlSearchParams.delete('id');
  const urlToShare = encodeURI(
    `${window.location.origin}/integration/${intl.locale}/${srcPath}${
      studyType ? '/' : ''
    }${studyType}${
      Array.from(urlSearchParams).length ? '?' : ''
    }${urlSearchParams}`,
  );
  const shareFill = getCSSValue('--blue-soft-100');
  const clipboardContent = `<iframe id="${srcPath}" title="${title}" width="800" height="${height}" src="${urlToShare}"></iframe>`;

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
                  {`Sources : ${source}`}
                </Text>
              ) : null}
              {source && srcPath ? <hr /> : null}
              <p>
                {enableExport && (
                  <>
                    <Text size='xs' as='span'>
                      <FormattedMessage
                        id='app.graph.download'
                        defaultMessage='Download'
                      />
                    </Text>
                    {onCsvButtonClick && (
                      <span
                        className='icon-click ml-10 mr-26'
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
                          className='ds-fr--v-text-top'
                        >
                          <Text size='xs' as='span'>
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
                        className='icon-click mr-120'
                        tabIndex={0}
                        role='button'
                        onClick={() => onPngButtonClick()}
                        onKeyPress={() => onPngButtonClick()}
                      >
                        <DSIcon
                          name='ri-file-chart-fill'
                          size='lg'
                          as='span'
                          iconPosition='right'
                          className='ds-fr--v-text-top'
                        >
                          <Text size='xs' as='span'>
                            <FormattedMessage
                              id='app.graph.download.png'
                              defaultMessage='PNG'
                            />
                          </Text>
                        </DSIcon>
                      </span>
                    )}
                  </>
                )}
                {srcPath && (
                  <span
                    className='icon-click mr-26'
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
                      className='ds-fr--v-text-top'
                    >
                      <Text size='xs' as='span' className=''>
                        <FormattedMessage
                          id='app.graph.integration'
                          defaultMessage='Integration'
                        />
                      </Text>
                    </DSIcon>
                  </span>
                )}
                <span
                  className='icon-click'
                  tabIndex={0}
                  role='button'
                  onClick={() => fullscreen()}
                  onKeyPress={() => fullscreen()}
                >
                  <DSIcon
                    name='ri-layout-grid-fill'
                    size='lg'
                    as='span'
                    iconPosition='right'
                    className='ds-fr--v-text-top'
                  >
                    <Text size='xs' as='span' className=''>
                      <FormattedMessage
                        id='app.graph.fullscreen'
                        defaultMessage='Plein écran'
                      />
                    </Text>
                  </DSIcon>
                </span>
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
                    defaultMessage='Share'
                    id='app.graph.share'
                  />
                </div>
                <TwitterShareButton
                  className='share-btn'
                  hashtags={['OpenAccess', 'ScienceOuverte', 'dataESR']}
                  related={['sup_recherche', 'ouvrirlascience']}
                  text={title}
                  title={title}
                  url={urlToShare}
                  via='ouvrirlascience'
                >
                  <XIcon size={30} bgStyle={{ fill: shareFill }} />
                </TwitterShareButton>
                <LinkedinShareButton
                  className='share-btn'
                  source='BSO'
                  summary={title}
                  title={title}
                  url={urlToShare}
                >
                  <LinkedinIcon size={30} bgStyle={{ fill: shareFill }} />
                </LinkedinShareButton>
                <FacebookShareButton
                  className='share-btn'
                  hashtag='ScienceOuverte'
                  quote={title}
                  url={urlToShare}
                >
                  <FacebookIcon size={30} bgStyle={{ fill: shareFill }} />
                </FacebookShareButton>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal
        className='graph-integration'
        hide={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        size='lg'
      >
        <ModalClose
          hide={() => {
            setIsModalOpen(false);
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
    </>
  );
};

export default GraphFooter;

GraphFooter.defaultProps = {
  date: '',
  enableExport: true,
  fullscreen: null,
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
  fullscreen: PropTypes.func,
  height: PropTypes.number,
  onCsvButtonClick: PropTypes.func,
  onPngButtonClick: PropTypes.func,
  source: PropTypes.string,
  srcPath: PropTypes.string, // pour lien intégration
  studyType: PropTypes.oneOf(studiesTypes),
  title: PropTypes.string,
};

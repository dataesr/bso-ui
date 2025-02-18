import './style.scss';

import { Alert, Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import GlossaryFormattedMessage from '../Glossary/GlossaryFormattedMessage';

const QuestionSection = ({
  anchorId,
  backgroundColor,
  children,
  ctas,
  glossaryKeys,
  intlKey,
  isDisplayed,
}) => {
  const intl = useIntl();
  const formatted = (
    <GlossaryFormattedMessage
      ctas={ctas}
      intlKey={`${intlKey}.description`}
      glossaryKeys={glossaryKeys}
    />
  );
  const description = intl.messages[`${intlKey}.description`] ? formatted : '';
  return (
    (isDisplayed || isDisplayed == null) && (
      <section
        style={{ backgroundColor, paddingTop: '28px' }}
        className='w-100 question-section'
        id={anchorId}
      >
        <Container>
          {isDisplayed && (
            <Alert
              description={intl.formatMessage({
                id: 'app.commons.section-warning',
              })}
              title=''
            />
          )}
          {intlKey && (
            <h2 className='marianne-extra-bold fs-20-26'>
              {intl.formatMessage({
                id: `${intlKey}.title`,
                defaultMessage: '',
              })}
            </h2>
          )}
          {description && <p>{description}</p>}
          {children}
        </Container>
      </section>
    )
  );
};

export default QuestionSection;

QuestionSection.defaultProps = {
  anchorId: '',
  backgroundColor: '',
  children: null,
  glossaryKeys: [],
  ctas: [],
  isDisplayed: null,
};
QuestionSection.propTypes = {
  anchorId: PropTypes.string,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  glossaryKeys: PropTypes.arrayOf(PropTypes.string),
  ctas: PropTypes.arrayOf(PropTypes.string),
  intlKey: PropTypes.string.isRequired,
  isDisplayed: PropTypes.bool,
};

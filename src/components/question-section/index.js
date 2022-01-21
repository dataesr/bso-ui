import { Alert, Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import GlossaryFormattedMessage from '../Glossary/GlossaryFormattedMessage';

const QuestionSection = ({
  anchorId,
  backgroundColor,
  children,
  glossaryKeys,
  intlKey,
  isDisplayed,
  ctas,
}) => {
  const intl = useIntl();
  const formatted = (
    <GlossaryFormattedMessage
      ctas={ctas}
      intlKey={`${intlKey}.description`}
      glossaryKeys={glossaryKeys}
    />
  );
  const description = intl.messages[`${intlKey}.description`]
    ? formatted
    : 'Description non rédigée';
  return (
    (isDisplayed || isDisplayed == null) && (
      <section
        style={{ backgroundColor, paddingTop: '28px' }}
        className='w-100'
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
          <h2 className='marianne-extra-bold fs-20-26'>
            {intl.formatMessage({ id: `${intlKey}.title` })}
          </h2>
          <p>{description}</p>
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

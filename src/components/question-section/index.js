/* eslint-disable react/require-default-props */
import { Alert, Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import GlossaryFormattedMessage from '../Glossary/GlossaryFormattedMessage';

function QuestionSection({
  anchorId = '',
  backgroundColor = '',
  children = null,
  ctas = [],
  glossaryKeys = [],
  intlKey,
  isDisplayed = null,
}) {
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
}

export default QuestionSection;

QuestionSection.propTypes = {
  anchorId: PropTypes.string,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  glossaryKeys: PropTypes.arrayOf(PropTypes.string),
  ctas: PropTypes.arrayOf(PropTypes.string),
  intlKey: PropTypes.string.isRequired,
  isDisplayed: PropTypes.bool,
};

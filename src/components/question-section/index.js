import { Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import GlossaryFormattedMessage from '../Glossary/GlossaryFormattedMessage';

const QuestionSection = ({
  intlKey,
  backgroundColor,
  children,
  anchorId,
  glossaryKeys,
}) => {
  const intl = useIntl();
  const formatted = (
    <GlossaryFormattedMessage
      intlKey={`${intlKey}.description`}
      glossaryKeys={glossaryKeys}
    />
  );
  const description = intl.messages[`${intlKey}.description`]
    ? formatted
    : 'desciption non rédigée';
  return (
    <section
      style={{ backgroundColor, paddingTop: '28px' }}
      className='w-100'
      id={anchorId}
    >
      <Container>
        <h2 className='marianne-extra-bold fs-20-26'>
          {intl.formatMessage({ id: `${intlKey}.title` })}
        </h2>
        <p>{description}</p>
        {children}
      </Container>
    </section>
  );
};

export default QuestionSection;

QuestionSection.defaultProps = {
  backgroundColor: '',
  anchorId: '',
  children: null,
  glossaryKeys: [],
};
QuestionSection.propTypes = {
  glossaryKeys: PropTypes.arrayOf(PropTypes.string),
  intlKey: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  anchorId: PropTypes.string,
};

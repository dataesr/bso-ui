import { Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

const QuestionSection = ({ intlKey, backgroundColor, children }) => {
  const intl = useIntl();
  return (
    <section style={{ backgroundColor, paddingTop: '28px' }} className='w-100'>
      <Container>
        <h2>
          {intl.formatMessage({ id: `${intlKey}.title` })}
          <span>i</span>
        </h2>
        <p>{intl.formatMessage({ id: `${intlKey}.description` })}</p>
        {children}
      </Container>
    </section>
  );
};

export default QuestionSection;

QuestionSection.defaultProps = {
  backgroundColor: '',
  children: null,
};
QuestionSection.propTypes = {
  intlKey: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
};

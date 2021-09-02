import { Container, Icon as DSIcon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

const QuestionSection = ({ intlKey, backgroundColor, children, anchorId }) => {
  const intl = useIntl();
  return (
    <section
      style={{ backgroundColor, paddingTop: '28px' }}
      className='w-100'
      id={anchorId}
    >
      <Container>
        <DSIcon
          name='ri-information-fill'
          size='lg'
          as='span'
          iconPosition='right'
          className='ds-fr--v-middle'
        >
          <h2 className='marianne-extra-bold fs-20-26'>
            {intl.formatMessage({ id: `${intlKey}.title` })}
          </h2>
        </DSIcon>
        <p>{intl.formatMessage({ id: `${intlKey}.description` })}</p>
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
};
QuestionSection.propTypes = {
  intlKey: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  anchorId: PropTypes.string,
};

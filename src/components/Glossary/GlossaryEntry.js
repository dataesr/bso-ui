import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function GlossaryEntry({ intlKey, glossaryKey, defaultMessage }) {
  return (
    <span className='glossary-entry' data-glossary-key={glossaryKey}>
      <FormattedMessage id={intlKey} defaultMessage={defaultMessage} />
    </span>
  );
}

GlossaryEntry.defaultProps = {
  defaultMessage: '?',
};
GlossaryEntry.propTypes = {
  defaultMessage: PropTypes.string,
  glossaryKey: PropTypes.string.isRequired,
  intlKey: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
};
export default GlossaryEntry;

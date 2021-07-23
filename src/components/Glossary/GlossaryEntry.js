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
  glossaryKey: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  intlKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};
export default GlossaryEntry;

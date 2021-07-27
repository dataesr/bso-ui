import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import GlossaryEntry from './GlossaryEntry';

function GlossaryFormattedMessage({ intlKey, link, glossaryKey }) {
  return (
    <FormattedMessage
      id={intlKey}
      values={{
        cta: (chunks) => (
          <a target='_blank' href={`${link}`} rel='noreferrer'>
            {chunks}
          </a>
        ),
        glossary: (chunks) => (
          <GlossaryEntry
            link={link}
            intlKey={chunks}
            glossaryKey={glossaryKey}
          />
        ),
      }}
    />
  );
}

GlossaryFormattedMessage.defaultProps = {
  link: () => {},
};
GlossaryFormattedMessage.propTypes = {
  glossaryKey: PropTypes.string.isRequired,
  intlKey: PropTypes.string.isRequired,
  link: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};
export default GlossaryFormattedMessage;

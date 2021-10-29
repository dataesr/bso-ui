import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import GlossaryEntry from './GlossaryEntry';

function GlossaryFormattedMessage({ intlKey, link, glossaryKeys }) {
  const values = {};
  glossaryKeys.forEach((g, i) => {
    values[`glossary${i + 1}`] = (chunks) => (
      <GlossaryEntry link={link} intlKey={chunks} glossaryKey={g} />
    );
  });

  return (
    <FormattedMessage
      id={intlKey}
      values={{
        cta: (chunks) => (
          <a target='_blank' href={`${link}`} rel='noreferrer'>
            {chunks}
          </a>
        ),
        ...values,
      }}
    />
  );
}

GlossaryFormattedMessage.defaultProps = {
  link: () => {},
};
GlossaryFormattedMessage.propTypes = {
  glossaryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  intlKey: PropTypes.string.isRequired,
  link: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};
export default GlossaryFormattedMessage;

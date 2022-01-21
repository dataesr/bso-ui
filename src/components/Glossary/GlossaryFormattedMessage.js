import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

import GlossaryEntry from './GlossaryEntry';

function GlossaryFormattedMessage({ intlKey, glossaryKeys, ctas = [] }) {
  const values = {};
  const link = ctas[0] || '';

  glossaryKeys.forEach((g, i) => {
    values[`glossary${i}`] = (chunks) => (
      <GlossaryEntry link={link} intlKey={chunks} glossaryKey={g} />
    );
  });

  ctas.forEach((cta, i) => {
    values[`cta${i}`] = (chunks) => (
      <a href={cta} target='_blank' rel='noreferrer'>
        {chunks}
      </a>
    );
  });

  return (
    <FormattedMessage
      id={intlKey}
      values={{
        cta: (chunks) => (link ? (
          <a target='_blank' href={link} rel='noreferrer'>
            {chunks}
          </a>
        ) : null),
        linebreak: (chunks) => (
          <>
            {sanitizeHtml(chunks)}
            <br />
          </>
        ),
        ...values,
      }}
    />
  );
}

GlossaryFormattedMessage.defaultProps = {
  ctas: [],
};
GlossaryFormattedMessage.propTypes = {
  glossaryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  intlKey: PropTypes.string.isRequired,
  ctas: PropTypes.arrayOf(PropTypes.string),
};

export default GlossaryFormattedMessage;

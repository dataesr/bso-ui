/* eslint-disable no-param-reassign */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import sanitizeHtml from 'sanitize-html';

import { getObservationLabel } from '../../utils/helpers';
import useGlobals from '../../utils/Hooks/useGetGlobals';
import GlossaryEntry from './GlossaryEntry';

function GlossaryFormattedMessage({
  ctas = [],
  glossaryKeys,
  intlKey,
  values = {},
}) {
  const { beforeLastObservationSnap } = useGlobals();
  const intl = useIntl();
  values.publicationYear = getObservationLabel(beforeLastObservationSnap, intl);
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
        i: (chunks) => <i>{chunks}</i>,
        ...values,
      }}
    />
  );
}

GlossaryFormattedMessage.propTypes = {
  ctas: PropTypes.arrayOf(PropTypes.string),
  glossaryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  intlKey: PropTypes.string.isRequired,
  values: PropTypes.object,
};
GlossaryFormattedMessage.defaultProps = {
  ctas: [],
  values: {},
};

export default GlossaryFormattedMessage;

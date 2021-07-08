import { Icon as DSIcon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

function GlossaryItem({ entry, active, definition, className, glossaryKey }) {
  return (
    <article
      data-glossary-entry={glossaryKey}
      className={classNames(`glossary-item mb-20 pb-16 ${className}`, {
        active,
      })}
    >
      {active ? (
        <DSIcon
          className='ds-fr--v-middle'
          name='ri-arrow-right-line'
          size='1x'
        >
          <p className='m-0 fs-16-24 marianne-medium'>{entry}</p>
        </DSIcon>
      ) : (
        <p className='m-0 fs-16-24 marianne-medium'>{entry}</p>
      )}
      <p className='fs-14-24 m-0'>{definition}</p>
    </article>
  );
}

GlossaryItem.propTypes = {
  glossaryKey: PropTypes.string.isRequired,
  entry: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  definition: PropTypes.string.isRequired,
};
export default GlossaryItem;

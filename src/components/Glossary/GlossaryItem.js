import { Icon as DSIcon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const GlossaryItem = forwardRef((props, ref) => {
  const { word, active, definition, index, glossaryKey } = props;

  return (
    <article
      ref={ref}
      data-glossary-word={glossaryKey}
      className={classNames('word-item mb-20 pb-16', {
        'pt-20': index === 0,
        active,
      })}
    >
      {active ? (
        <DSIcon
          className='ds-fr--v-middle'
          name='ri-arrow-right-line'
          size='1x'
        >
          <p className='m-0 fs-16-24 marianne-medium'>{word}</p>
        </DSIcon>
      ) : (
        <p className='m-0 fs-16-24 marianne-medium'>{word}</p>
      )}
      <p className='fs-14-24 m-0'>{definition}</p>
    </article>
  );
});

GlossaryItem.propTypes = {
  glossaryKey: PropTypes.string.isRequired,
  word: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  definition: PropTypes.bool.isRequired,
};
export default GlossaryItem;

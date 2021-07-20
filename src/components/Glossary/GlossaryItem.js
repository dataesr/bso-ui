import { Icon as DSIcon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function GlossaryItem({
  intlEntry,
  active,
  intlDefinition,
  className,
  glossaryKey,
  link,
}) {
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
          <p className='m-0 fs-16-24 marianne-medium'>
            <FormattedMessage
              id={intlEntry}
              defaultMessage={intlEntry}
              values={{
                cta: (chunks) => (
                  <a target='_blank' href={`${link}`} rel='noreferrer'>
                    {chunks}
                  </a>
                ),
              }}
            />
          </p>
        </DSIcon>
      ) : (
        <p className='m-0 fs-16-24 marianne-medium'>
          <FormattedMessage
            id={intlEntry}
            defaultMessage={intlEntry}
            values={{
              cta: (chunks) => (
                <a target='_blank' href={`${link}`} rel='noreferrer'>
                  {chunks}
                </a>
              ),
            }}
          />
        </p>
      )}
      <p className='fs-14-24 m-0'>
        <FormattedMessage
          id={intlDefinition}
          defaultMessage={intlDefinition}
          values={{
            cta: (chunks) => (
              <a target='_blank' href={`${link}`} rel='noreferrer'>
                {chunks}
              </a>
            ),
          }}
        />
      </p>
    </article>
  );
}

GlossaryItem.defaultProps = {
  link: () => {},
};

GlossaryItem.propTypes = {
  glossaryKey: PropTypes.string.isRequired,
  link: PropTypes.func,
  intlEntry: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  intlDefinition: PropTypes.string.isRequired,
};
export default GlossaryItem;

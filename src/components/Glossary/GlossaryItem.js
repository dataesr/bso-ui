/* eslint-disable react/require-default-props */
import { Icon as DSIcon } from '@dataesr/react-dsfr';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function GlossaryItem({
  active,
  className,
  glossaryKey,
  intlDefinition,
  intlEntry,
  link = () => {},
}) {
  let values = {};
  if (link) {
    if (typeof link === 'object') {
      link?.forEach((cta, i) => {
        values[`cta${i}`] = (chunks) => (
          <a href={cta} target='_blank' rel='noreferrer'>
            {chunks}
          </a>
        );
      });
    } else {
      values = {
        cta: (chunks) => (
          <a href={`${link}`} target='_blank' rel='noreferrer'>
            {chunks}
          </a>
        ),
      };
    }
  }

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
              values={values}
            />
          </p>
        </DSIcon>
      ) : (
        <p className='m-0 fs-16-24 marianne-medium'>
          <FormattedMessage
            id={intlEntry}
            defaultMessage={intlEntry}
            values={values}
          />
        </p>
      )}
      <p className='fs-14-24 m-0'>
        <FormattedMessage
          id={intlDefinition}
          defaultMessage={intlDefinition}
          values={values}
        />
      </p>
    </article>
  );
}

GlossaryItem.propTypes = {
  glossaryKey: PropTypes.string.isRequired,
  link: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.array,
  ]),
  intlEntry: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  intlDefinition: PropTypes.string.isRequired,
};
export default GlossaryItem;

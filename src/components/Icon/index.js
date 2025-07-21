// https://codesandbox.io/s/serene-beaver-hi5wo?file=/src/Icon.js
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { getCSSValue, setCSSProperty } from '../../utils/helpers';

/**
 *
 * @param name
 * @param borderColor
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
function Icon({ name, color1, color2, ...rest }) {
  const [iconModule, setIconModule] = useState();
  useEffect(() => {
    import(
      `!!@svgr/webpack?-svgo,+titleProp,+ref!./../../components/Icon/svg/${name}.svg`
    )
      .then((module) => {
        setIconModule(module);
      })
      .catch((error) => {
        console.error(`Icon with name: ${name} not found! - ${error}`); // eslint-disable-line
      });
  }, [name]);

  const renderIcon = () => {
    if (!iconModule) return null;

    setCSSProperty(`--${name}-color-1`, getCSSValue(`--${color1}`) || color1);

    setCSSProperty(`--${name}-color-2`, getCSSValue(`--${color2}`) || color2);

    /**
     * Equal to:
     * import { ReactComponent as Icon } from "./path/to/icon.svg";
     */
    const Component = iconModule.default;
    return <Component {...rest} />;
  };

  return <div className={`${name}`}>{renderIcon()}</div>;
}

Icon.defaultProps = {
  color1: 'blue-dark-125',
  color2: 'blue-dark-125',
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color1: PropTypes.string,
  color2: PropTypes.string,
};
export default Icon;

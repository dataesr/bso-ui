import PropTypes from 'prop-types';

export default function Chip({ title }) {
  return <div className="chip marianne-bold text-center">{title}</div>;
}
Chip.propTypes = {
  title: PropTypes.string.isRequired,
};

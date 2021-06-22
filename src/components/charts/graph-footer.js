import { Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

const GraphFooter = ({
  source,
  date,
  graphId,
  // onCsvButtonClick,
  // onXlsButtonClick,
  // onPngButtonClick,
}) => (
  <div style={{ backgroundColor: '#EDEDF2' }}>
    <Container>
      {date ? `Données mise à jour le ${date}` : null}
      {date && source ? <hr /> : null}
      {source ? `Source : ${source}` : null}
      {source && graphId ? <hr /> : null}
      {graphId && <a href={`/integration/${graphId}`}>cible du lien d'integration</a>}
    </Container>
    <div style={{ backgroundColor: '#5770BE' }}>
      <Container>share</Container>
    </div>
  </div>
);

export default GraphFooter;

GraphFooter.defaultProps = {
  source: '',
  date: '',
  graphId: '',
  // onCsvButtonClick: null,
  // onXlsButtonClick: null,
  // onPngButtonClick: null,
};
GraphFooter.propTypes = {
  source: PropTypes.string,
  date: PropTypes.string,
  graphId: PropTypes.string, // pour lien intégration
  // onCsvButtonClick: PropTypes.func,
  // onXlsButtonClick: PropTypes.func,
  // onPngButtonClick: PropTypes.func,
};

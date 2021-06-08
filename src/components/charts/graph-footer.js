import { Container } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import React from 'react';

const GraphFooter = ({
  source,
  date,
  graphId,
  onCsvButtonClick,
  onXlsButtonClick,
  onPngButtonClick,
}) => (
  <div style={{ backgroundColor: '#EDEDF2' }}>
    <Container>
      {date ? `Données mise à jour le ${date}` : null}
      {date && source ? <hr /> : null}
      {source ? `Source : ${source}` : null}
    </Container>
  </div>
);

export default GraphFooter;

GraphFooter.prototype = {
  source: PropTypes.string,
  date: PropTypes.string,
  graphId: PropTypes.string,
  onCsvButtonClick: PropTypes.func,
  onXlsButtonClick: PropTypes.func,
  onPngButtonClick: PropTypes.func,
};

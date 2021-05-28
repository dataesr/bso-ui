import './style.scss';

import { Link as DSLink } from '@dataesr/react-dsfr';
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="Home">
      <h1>Home</h1>
      <ul>
        <li>
          <DSLink as={<Link to="/baro-national" />} href="/my-page" isSimple>
            Baromètre National
          </DSLink>
        </li>
        <li>
          <Link to="/baro-sante">Baromètre Santé</Link>
          <ul>
            <li>
              <Link to="/baro-sante/essais-cliniques">Essai Cliniques</Link>
            </li>
            <li>
              <Link to="/baro-sante/publications">
                Baromètre Santé Publications
              </Link>
            </li>
            <li>
              <Link to="/baro-sante/etudes">Etudes Observationnelles</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/theme">Thèmes</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;

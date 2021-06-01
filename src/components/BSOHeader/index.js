import {
  Header as DSHeader,
  HeaderBody,
  HeaderNav,
  Logo,
  NavItem,
  NavSubItem,
  Service,
} from '@dataesr/react-dsfr';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function BSOHeader() {
  const [path, setPath] = useState(useLocation());
  const location = useLocation();
  console.debug('==== BSOHeader ==== ', path);
  useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
    }
  }, [path, setPath, location]);
  return (
    <DSHeader closeButtonLabel="fermer">
      <HeaderBody>
        <Logo splitCharacter={10}>
          Ministère de l'enseignement supérieur et de la recherche
        </Logo>
        <Service
          title="Le Baromètre français de la Science Ouverte"
          description="Le Baromètre français de la Science Ouverte"
        />
      </HeaderBody>
      <HeaderNav>
        <NavItem title="Le baromètre national">
          <NavSubItem
            current={path === '/baro-national'}
            title="Accueil baromètre national"
            asLink={<RouterLink to="/baro-national" />}
          />
          <NavSubItem
            current={path === '/baro-national/publications'}
            title="Les publications"
            asLink={<RouterLink to="/baro-national/publications" />}
          />
        </NavItem>
        <NavItem title="Le baromètre santé">
          <NavSubItem
            current={path === '/baro-sante'}
            title="Accueil baromètre santé"
            asLink={<RouterLink to="/baro-sante" />}
          />
          <NavSubItem
            current={path === '/baro-sante/publications'}
            title="Les publications en santé"
            asLink={<RouterLink to="/baro-sante/publications" />}
          />
          <NavSubItem
            current={path === '/baro-sante/essais-cliniques'}
            title="Les essais cliniques"
            asLink={<RouterLink to="/baro-sante/essais-cliniques" />}
          />
          <NavSubItem
            title="Les études observationnelles"
            asLink={<RouterLink to="/baro-sante/etudes" />}
          />
        </NavItem>
        <NavItem title="Thèmes" asLink={<RouterLink to="/themes" />} />
        <NavItem title="À propos">
          <NavSubItem
            title="Méthodologie"
            asLink={<RouterLink to="/methodologie" />}
          />
          <NavSubItem title="FAQ" asLink={<RouterLink to="/faq" />} />
          <NavSubItem
            title="Glossaire"
            asLink={<RouterLink to="/glossaire" />}
          />
          <NavSubItem title="Le projet" asLink={<RouterLink to="/projet" />} />
          <NavSubItem
            title="Notes flash"
            asLink={<RouterLink to="/notes-flash" />}
          />
        </NavItem>
      </HeaderNav>
    </DSHeader>
  );
}
export default BSOHeader;

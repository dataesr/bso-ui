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

function Header() {
  const location = useLocation();
  const [path, setPath] = useState(() => location.pathname || '');

  useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
    }
  }, [path, setPath, location]);

  return (
    <DSHeader closeButtonLabel='fermer'>
      <HeaderBody>
        <Logo splitCharacter={10}>
          Ministère de l'enseignement supérieur et de la recherche
        </Logo>
        <Service
          description=''
          className='main-title'
          title='Le Baromètre français de la Science Ouverte'
        />
      </HeaderBody>
      <HeaderNav path={path}>
        <NavItem
          current={path === '/baro-national'}
          title='Le baromètre national'
        >
          <NavSubItem
            current={path === '/baro-national'}
            title='Accueil baromètre national'
            asLink={<RouterLink to='/baro-national' />}
          />
          <NavSubItem
            current={path === '/baro-national/publications'}
            title='Les publications'
            asLink={<RouterLink to='/baro-national/publications' />}
          />
        </NavItem>
        <NavItem
          current={path.startsWith('/baro-sante')}
          title='Le baromètre santé'
        >
          <NavSubItem
            current={path === '/baro-sante'}
            title='Accueil baromètre santé'
            asLink={<RouterLink to='/baro-sante' />}
          />
          <NavSubItem
            current={path === '/baro-sante/publications'}
            title='Les publications en santé'
            asLink={<RouterLink to='/baro-sante/publications' />}
          />
          <NavSubItem
            current={path === '/baro-sante/essais-cliniques'}
            title='Les essais cliniques'
            asLink={<RouterLink to='/baro-sante/essais-cliniques' />}
          />
          <NavSubItem
            current={path === '/baro-sante/etudes'}
            title='Les études observationnelles'
            asLink={<RouterLink to='/baro-sante/etudes' />}
          />
        </NavItem>
        <NavItem
          current={path === '/themes'}
          title='Thèmes'
          asLink={<RouterLink to='/themes' />}
        />
        <NavItem current={path.startsWith('/a-propos')} title='À propos'>
          <NavSubItem
            current={path === '/a-propos/methodologie'}
            title='Méthodologie'
            asLink={<RouterLink to='/a-propos/methodologie' />}
          />
          <NavSubItem
            current={path === '/a-propos/faq'}
            title='FAQ'
            asLink={<RouterLink to='/a-propos/faq' />}
          />
          <NavSubItem
            current={path === '/a-propos/glossaire'}
            title='Glossaire'
            asLink={<RouterLink to='/a-propos/glossaire' />}
          />
          <NavSubItem
            current={path === '/a-propos/projet'}
            title='Le projet'
            asLink={<RouterLink to='/a-propos/projet' />}
          />
          <NavSubItem
            current={path === '/a-propos/notes-flash'}
            title='Notes flash'
            asLink={<RouterLink to='/a-propos/notes-flash' />}
          />
        </NavItem>
      </HeaderNav>
    </DSHeader>
  );
}
export default Header;

import {
  Header as DSHeader,
  HeaderBody,
  HeaderNav,
  Logo,
  NavItem,
  NavSubItem,
  Service,
  Tool,
  ToolItemGroup,
} from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import SwitchThemeButton from '../UI/SwitchLangButton';
import SwitchLangButton from '../UI/SwitchThemeButton';

function Header() {
  const intl = useIntl();
  const location = useLocation();
  const [path, setPath] = useState(() => location.pathname || '');

  useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
    }
  }, [path, setPath, location]);

  return (
    <DSHeader closeButtonLabel='fermer' className='bso-header'>
      <HeaderBody>
        <Logo splitCharacter={10}>
          Ministère de l'enseignement supérieur et de la recherche
        </Logo>
        <Service
          description=''
          className='main-title'
          title={intl.formatMessage({
            id: 'app.header.title',
            defaultMessage: 'Baromêtre français de la science ouverte',
          })}
        />
      </HeaderBody>
      <Tool>
        <ToolItemGroup>
          <SwitchThemeButton />
          <SwitchLangButton />
        </ToolItemGroup>
      </Tool>
      <HeaderNav path={path}>
        <NavItem
          current={path === '/baro-national'}
          title={intl.formatMessage({
            id: 'app.header.nav.baro-national',
            defaultMessage: 'Le Baromètre national',
          })}
        >
          <NavSubItem
            current={path === '/baro-national'}
            title='Accueil baromètre national'
            asLink={<RouterLink to='/baro-national' />}
          />
          <NavSubItem
            current={path === '/baro-national/publications'}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-national-publications',
              defaultMessage: 'Les publications',
            })}
            asLink={<RouterLink to='/baro-national/publications' />}
          />
        </NavItem>
        <NavItem
          current={path.startsWith('/baro-sante')}
          title={intl.formatMessage({
            id: 'app.header.nav.baro-sante',
            defaultMessage: 'Le baromètre santé',
          })}
        >
          <NavSubItem
            current={path === '/baro-sante'}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-acceuil',
              defaultMessage: 'Accueil baromètre santé',
            })}
            asLink={<RouterLink to='/baro-sante' />}
          />
          <NavSubItem
            current={path === '/baro-sante/publications'}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-publications',
              defaultMessage: 'Les publications en santé',
            })}
            asLink={<RouterLink to='/baro-sante/publications' />}
          />
          <NavSubItem
            current={path === '/baro-sante/essais-cliniques'}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-essais',
              defaultMessage: 'Les essais cliniques',
            })}
            asLink={<RouterLink to='/baro-sante/essais-cliniques' />}
          />
          <NavSubItem
            current={path === '/baro-sante/etudes'}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-etudes',
              defaultMessage: 'Les études observationnelles',
            })}
            asLink={<RouterLink to='/baro-sante/etudes' />}
          />
        </NavItem>
        <NavItem
          current={path === '/themes'}
          title={intl.formatMessage({
            id: 'app.header.nav.themes',
            defaultMessage: 'Thèmes',
          })}
          asLink={<RouterLink to='/themes' />}
        />
        <NavItem
          current={path.startsWith('/a-propos')}
          title={intl.formatMessage({
            id: 'app.header.nav.a-propos',
            defaultMessage: 'À propos',
          })}
        >
          <NavSubItem
            current={path === '/a-propos/methodologie'}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-methodologie',
              defaultMessage: 'Méthodologie',
            })}
            asLink={<RouterLink to='/a-propos/methodologie' />}
          />
          <NavSubItem
            current={path === '/a-propos/faq'}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-faq',
              defaultMessage: 'FAQ',
            })}
            asLink={<RouterLink to='/a-propos/faq' />}
          />
          <NavSubItem
            current={path === '/a-propos/glossaire'}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-gloassaire',
              defaultMessage: 'Glossaire',
            })}
            asLink={<RouterLink to='/a-propos/glossaire' />}
          />
          <NavSubItem
            current={path === '/a-propos/projet'}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-projet',
              defaultMessage: 'Le projet',
            })}
            asLink={<RouterLink to='/a-propos/projet' />}
          />
          <NavSubItem
            current={path === '/a-propos/notes-flash'}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-notes-flash',
              defaultMessage: 'Notes flash',
            })}
            asLink={<RouterLink to='/a-propos/notes-flash' />}
          />
        </NavItem>
      </HeaderNav>
    </DSHeader>
  );
}
export default Header;

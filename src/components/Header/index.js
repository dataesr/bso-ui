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

import useLang from '../../utils/Hooks/useLang';
import SwitchThemeButton from '../UI/SwitchLangButton';
import SwitchLangButton from '../UI/SwitchThemeButton';

function Header() {
  const { lang, urls } = useLang();
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
        <Tool>
          <ToolItemGroup>
            <SwitchThemeButton />
            <SwitchLangButton />
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      <HeaderNav path={path}>
        <NavItem
          current={path === urls.home[lang]}
          title={intl.formatMessage({
            id: 'app.header.nav.baro-national',
            defaultMessage: 'Le Baromètre national',
          })}
        >
          <NavSubItem
            current={path === urls.home[lang]}
            title='Accueil baromètre national'
            asLink={(
              <RouterLink to={urls.home[lang]}>
                Accueil baromètre national
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.nationalPublications[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-national-publications',
              defaultMessage: 'Les publications',
            })}
            asLink={(
              <RouterLink to={urls.nationalPublications[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.baro-national-publications',
                  defaultMessage: 'Les publications',
                })}
              </RouterLink>
            )}
          />
        </NavItem>
        <NavItem
          current={path.startsWith(urls.sante[lang])}
          title={intl.formatMessage({
            id: 'app.header.nav.baro-sante',
            defaultMessage: 'Le baromètre santé',
          })}
        >
          <NavSubItem
            current={path === urls.sante[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-acceuil',
              defaultMessage: 'Accueil baromètre santé',
            })}
            asLink={(
              <RouterLink to={urls.sante[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.baro-sante-acceuil',
                  defaultMessage: 'Accueil baromètre santé',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.santePublications[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-publications',
              defaultMessage: 'Les publications en santé',
            })}
            asLink={(
              <RouterLink to={urls.santePublications[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.baro-sante-publications',
                  defaultMessage: 'Les publications en santé',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.santeEssais[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-essais',
              defaultMessage: 'Les essais cliniques',
            })}
            asLink={(
              <RouterLink to={urls.santeEssais[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.baro-sante-essais',
                  defaultMessage: 'Les essais cliniques',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.santeEtudes[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-sante-etudes',
              defaultMessage: 'Les études observationnelles',
            })}
            asLink={(
              <RouterLink to={urls.santeEtudes[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.baro-sante-etudes',
                  defaultMessage: 'Les études observationnelles',
                })}
              </RouterLink>
            )}
          />
        </NavItem>
        <NavItem
          current={path === urls.themes[lang]}
          title={intl.formatMessage({
            id: 'app.header.nav.themes',
            defaultMessage: 'Thèmes',
          })}
          asLink={(
            <RouterLink to={urls.themes[lang]}>
              {intl.formatMessage({
                id: 'app.header.nav.themes',
                defaultMessage: 'Thèmes',
              })}
            </RouterLink>
          )}
        />
        <NavItem
          current={path.startsWith(`/${urls.methodologie[lang].split('/')[1]}`)}
          title={intl.formatMessage({
            id: 'app.header.nav.a-propos',
            defaultMessage: 'À propos',
          })}
        >
          <NavSubItem
            current={path === urls.methodologie[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-methodologie',
              defaultMessage: 'Méthodologie',
            })}
            asLink={(
              <RouterLink to={urls.methodologie[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.a-propos-methodologie',
                  defaultMessage: 'Méthodologie',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.faq[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-faq',
              defaultMessage: 'FAQ',
            })}
            asLink={(
              <RouterLink to={urls.faq[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.a-propos-faq',
                  defaultMessage: 'FAQ',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.glossaire[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-gloassaire',
              defaultMessage: 'Glossaire',
            })}
            asLink={(
              <RouterLink to={urls.glossaire[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.a-propos-gloassaire',
                  defaultMessage: 'Glossaire',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.projet[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-projet',
              defaultMessage: 'Le projet',
            })}
            asLink={(
              <RouterLink to={urls.projet[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.a-propos-projet',
                  defaultMessage: 'Le projet',
                })}
              </RouterLink>
            )}
          />
          <NavSubItem
            current={path === urls.flash[lang]}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos-notes-flash',
              defaultMessage: 'Notes flash',
            })}
            asLink={(
              <RouterLink to={urls.flash[lang]}>
                {intl.formatMessage({
                  id: 'app.header.nav.a-propos-notes-flash',
                  defaultMessage: 'Notes flash',
                })}
              </RouterLink>
            )}
          />
        </NavItem>
      </HeaderNav>
    </DSHeader>
  );
}
export default Header;

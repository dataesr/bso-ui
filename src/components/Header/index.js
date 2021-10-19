import {
  Header as DSHeader,
  HeaderBody,
  HeaderNav,
  Logo,
  NavItem,
  NavSubItem,
  Service,
  SkiplinkItem,
  Skiplinks,
  Tool,
  ToolItem,
  ToolItemGroup,
} from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { stringIsIntTheKitchen } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';
import SwitchLangButton from '../UI/SwitchLangButton';
import WrapperDisplay from '../WrapperDisplay';

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
    <WrapperDisplay display={!path.startsWith('/integration')}>
      <Skiplinks>
        <SkiplinkItem href={urls.national[lang]}>
          {intl.formatMessage({
            id: 'app.header.title',
            defaultMessage: 'Baromètre français de la Science Ouverte',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalPublications.tabs[0][lang]}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-national-publications',
            defaultMessage: 'Les publications',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.sante[lang]}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-sante',
            defaultMessage: 'Le baromètre santé',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.santeEssais.tabs[0][lang]}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-sante-essais',
            defaultMessage: 'Les essais cliniques',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.santeEtudes.tabs[0][lang]}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-sante-etudes',
            defaultMessage: 'Les études observationnelles',
          })}
        </SkiplinkItem>
      </Skiplinks>
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
              defaultMessage: 'Baromètre français de la Science Ouverte',
            })}
          />
          <Tool>
            <ToolItemGroup>
              <ToolItem as='div'>
                <SwitchLangButton />
              </ToolItem>
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <HeaderNav path={path}>
          <NavItem
            current={
              path === '/'
              || stringIsIntTheKitchen(path, lang, urls.nationalPublications.tabs)
                .length > 0
            }
            title={intl.formatMessage({
              id: 'app.header.nav.baro-national',
              defaultMessage: 'Le baromètre national',
            })}
          >
            <NavSubItem
              current={path === urls.national[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.baro-national-accueil',
                defaultMessage: 'Accueil baromètre national',
              })}
              asLink={<RouterLink to={urls.national[lang]} />}
            />
            <NavSubItem
              current={
                stringIsIntTheKitchen(
                  path,
                  lang,
                  urls.nationalPublications.tabs,
                ).length > 0
              }
              title={intl.formatMessage({
                id: 'app.header.nav.baro-national-publications',
                defaultMessage: 'Les publications',
              })}
              asLink={
                <RouterLink to={urls.nationalPublications.tabs[0][lang]} />
              }
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
                id: 'app.header.nav.baro-sante-accueil',
                defaultMessage: 'Accueil baromètre santé',
              })}
              asLink={<RouterLink to={urls.sante[lang]} />}
            />
            <NavSubItem
              current={
                stringIsIntTheKitchen(path, lang, urls.santePublications.tabs)
                  .length > 0
              }
              title={intl.formatMessage({
                id: 'app.header.nav.baro-sante-publications',
                defaultMessage: 'Les publications en santé',
              })}
              asLink={<RouterLink to={urls.santePublications.tabs[0][lang]} />}
            />
            <NavSubItem
              current={
                stringIsIntTheKitchen(path, lang, urls.santeEssais.tabs)
                  .length > 0
              }
              title={intl.formatMessage({
                id: 'app.header.nav.baro-sante-essais',
                defaultMessage: 'Les essais cliniques',
              })}
              asLink={<RouterLink to={urls.santeEssais.tabs[0][lang]} />}
            />
            <NavSubItem
              current={
                stringIsIntTheKitchen(path, lang, urls.santeEtudes.tabs)
                  .length > 0
              }
              title={intl.formatMessage({
                id: 'app.header.nav.baro-sante-etudes',
                defaultMessage: 'Les études observationnelles',
              })}
              asLink={<RouterLink to={urls.santeEtudes[lang]} />}
            />
          </NavItem>
          <NavItem
            current={path.startsWith(
              `/${urls.methodologie[lang].split('/')[1]}`,
            )}
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
              asLink={<RouterLink to={urls.methodologie[lang]} />}
            />
            <NavSubItem
              current={path === urls.faq[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-faq',
                defaultMessage: 'FAQ',
              })}
              asLink={<RouterLink to={urls.faq[lang]} />}
            />
            <NavSubItem
              current={path === urls.glossaire[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-glossaire',
                defaultMessage: 'Glossaire',
              })}
              asLink={<RouterLink to={urls.glossaire[lang]} />}
            />
            <NavSubItem
              current={path === urls.flash[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-notes-flash',
                defaultMessage: 'Notes flash',
              })}
              asLink={<RouterLink to={urls.flash[lang]} />}
            />
          </NavItem>
        </HeaderNav>
      </DSHeader>
    </WrapperDisplay>
  );
}
export default Header;

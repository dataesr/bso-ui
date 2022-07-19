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
  const { pathname, search } = useLocation();
  const [path, setPath] = useState(() => pathname || '');

  useEffect(() => {
    if (path !== pathname) {
      setPath(pathname);
    }
  }, [path, setPath, pathname]);

  return (
    <WrapperDisplay display={!path.startsWith('/integration')}>
      <Skiplinks>
        <SkiplinkItem href={urls.national[lang] + search}>
          {intl.formatMessage({
            id: 'app.header.title',
            defaultMessage: 'Baromètre français de la Science Ouverte',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalPublications.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-national-publications',
            defaultMessage: 'Les publications',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalResearchData[lang] + search}>
          {intl.formatMessage({
            id: 'app.publi.researchdata',
            defaultMessage: 'Les données de la recherche',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalSoftwareCodes[lang] + search}>
          {intl.formatMessage({
            id: 'app.publi.softwarecodes',
            defaultMessage: 'Les codes logiciels',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalThesis[lang] + search}>
          {intl.formatMessage({
            id: 'app.publi.thesis',
            defaultMessage: 'Les thèses de doctorat',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.sante[lang] + search}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-sante',
            defaultMessage: 'Le baromètre santé',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.santeEssais.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-sante-essais',
            defaultMessage: 'Les essais cliniques',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.santeEtudes.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.header.nav.baro-sante-etudes',
            defaultMessage: 'Les études observationnelles',
          })}
        </SkiplinkItem>
      </Skiplinks>
      <DSHeader
        closeButtonLabel={intl.formatMessage({
          id: 'app.commons.close',
          defaultMessage: 'Fermer',
        })}
        className='bso-header'
      >
        <HeaderBody>
          <Logo splitCharacter={10}>
            {intl.formatMessage({ id: 'app.ministry' })}
          </Logo>
          <Service
            description=''
            className='main-title'
            title={intl.formatMessage({
              id: 'app.header.title',
              defaultMessage: 'Baromètre français de la Science Ouverte',
            })}
            link={urls.national[lang] + search}
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
              asLink={<RouterLink to={urls.national[lang] + search} />}
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
              asLink={(
                <RouterLink
                  to={urls.nationalPublications.tabs[0][lang] + search}
                />
              )}
            />
            {/* <NavSubItem
              current={path === urls.nationalThesis[lang]}
              title={intl.formatMessage({
                id: 'app.publi.thesis',
                defaultMessage: 'Thèses de doctorat',
              })}
              asLink={(
                <RouterLink
                  to={urls.nationalThesis[lang] + search}
                />
              )}
            /> */}
            {/* <NavSubItem
              current={path === urls.nationalResearchData[lang]}
              title={intl.formatMessage({
                id: 'app.publi.researchdata',
                defaultMessage: 'Les données de la recherche',
              })}
              asLink={(
                <RouterLink
                  to={urls.nationalResearchData[lang] + search}
                />
              )}
            /> */}
            {/* <NavSubItem
              current={path === urls.nationalSoftwareCodes[lang]}
              title={intl.formatMessage({
                id: 'app.publi.softwarecodes',
                defaultMessage: 'Codes logiciels',
              })}
              asLink={(
                <RouterLink
                  to={urls.nationalSoftwareCodes[lang] + search}
                />
              )}
            /> */}
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
              asLink={<RouterLink to={urls.sante[lang] + search} />}
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
              asLink={(
                <RouterLink
                  to={urls.santePublications.tabs[0][lang] + search}
                />
              )}
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
              asLink={
                <RouterLink to={urls.santeEssais.tabs[0][lang] + search} />
              }
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
              asLink={<RouterLink to={urls.santeEtudes[lang] + search} />}
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
              asLink={<RouterLink to={urls.methodologie[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.faq[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-faq',
                defaultMessage: 'FAQ',
              })}
              asLink={<RouterLink to={urls.faq[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.glossaire[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-glossaire',
                defaultMessage: 'Glossaire',
              })}
              asLink={<RouterLink to={urls.glossaire[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.flash[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-notes-flash',
                defaultMessage: 'Notes flash',
              })}
              asLink={<RouterLink to={urls.flash[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.variations[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-variations',
                defaultMessage: 'Déclinaisons locales',
              })}
              asLink={<RouterLink to={urls.variations[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.opendata[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-opendata',
                defaultMessage: 'Données ouvertes et code source',
              })}
              asLink={<RouterLink to={urls.opendata[lang] + search} />}
            />
          </NavItem>
        </HeaderNav>
      </DSHeader>
    </WrapperDisplay>
  );
}
export default Header;

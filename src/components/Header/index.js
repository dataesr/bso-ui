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
  ToolTranslate,
  ToolTranslateItem,
} from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { isInProduction, stringIsIntTheKitchen } from '../../utils/helpers';
import useLang from '../../utils/Hooks/useLang';
import WrapperDisplay from '../WrapperDisplay';

function Header() {
  const intl = useIntl();
  const { lang, switchLang, urls } = useLang();
  const { pathname, search } = useLocation();
  const [path, setPath] = useState(() => pathname || '');
  const [selectedLang, setSelectedLang] = useState(lang);

  useEffect(() => {
    if (path !== pathname) {
      setPath(pathname);
    }
  }, [path, setPath, pathname]);

  useEffect(() => {
    if (!path.startsWith('/integration')) {
      switchLang(selectedLang, pathname, search);
    }
  }, [path, pathname, search, selectedLang, switchLang]);

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
        <SkiplinkItem href={urls.nationalResearchData.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.baro-national.data.title.beta',
            defaultMessage: 'Les données de la recherche',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalSoftwareCode.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.baro-national.software.title.beta',
            defaultMessage: 'Les codes logiciels',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalThesis.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.baro-national.thesis.title',
            defaultMessage: 'Les thèses de doctorat',
          })}
        </SkiplinkItem>
        <SkiplinkItem href={urls.nationalOrcid.tabs[0][lang] + search}>
          {intl.formatMessage({
            id: 'app.baro-national.orcid.title',
            defaultMessage: 'Suivi ORCID',
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
          <Logo splitCharacter={9}>
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
                <ToolTranslate
                  currentLang={selectedLang}
                  descCurrentLang='Current language'
                >
                  <ToolTranslateItem
                    href='/fr'
                    hrefLang={lang}
                    active={selectedLang === 'fr'}
                    onClick={() => setSelectedLang('fr')}
                  >
                    Français
                  </ToolTranslateItem>
                  <ToolTranslateItem
                    href='/en'
                    hrefLang={lang}
                    active={selectedLang === 'en'}
                    onClick={() => setSelectedLang('en')}
                  >
                    English
                  </ToolTranslateItem>
                </ToolTranslate>
              </ToolItem>
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <HeaderNav path={path}>
          <NavItem
            current={path.startsWith(urls.nationalPublications[lang])}
            title={intl.formatMessage({
              id: 'app.header.nav.baro-publications-theses',
              defaultMessage: 'Les publications et thèses',
            })}
          >
            <NavSubItem
              current={path === urls.nationalPublications[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.baro-national-accueil',
                defaultMessage: 'Accueil publications et thèses',
              })}
              asLink={
                <RouterLink to={urls.nationalPublications[lang] + search} />
              }
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
            <NavSubItem
              current={path === urls.nationalThesis[lang]}
              title={intl.formatMessage({
                id: 'app.publi.thesis',
                defaultMessage: 'Les thèses de doctorat',
              })}
              asLink={<RouterLink to={urls.nationalThesis[lang] + search} />}
            />
          </NavItem>
          <NavItem
            current={path.startsWith(urls.nationalDataCode[lang])}
            title={intl.formatMessage({
              id: 'app.header.nav.data-code',
              defaultMessage: 'Les données et code',
            })}
          >
            <NavSubItem
              current={path === urls.nationalDataCode[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.data-code-welcome',
                defaultMessage: 'Accueil données et code',
              })}
              asLink={<RouterLink to={urls.nationalDataCode[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.nationalResearchData[lang]}
              title={intl.formatMessage({
                id: 'app.baro-national.data.title.beta',
                defaultMessage: 'Les données de la recherche',
              })}
              asLink={
                <RouterLink to={urls.nationalResearchData[lang] + search} />
              }
            />
            <NavSubItem
              current={path === urls.nationalSoftwareCode[lang]}
              title={intl.formatMessage({
                id: 'app.baro-national.software.title.beta',
                defaultMessage: 'Les codes et logiciels',
              })}
              asLink={
                <RouterLink to={urls.nationalSoftwareCode[lang] + search} />
              }
            />
          </NavItem>
          <NavItem
            current={path.startsWith(urls.sante[lang])}
            title={intl.formatMessage({
              id: 'app.header.nav.health',
              defaultMessage: 'La santé',
            })}
          >
            <NavSubItem
              current={path === urls.sante[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.health-home',
                defaultMessage: 'Accueil santé',
              })}
              asLink={<RouterLink to={urls.sante[lang] + search} />}
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
          {!isInProduction() && (
            <NavItem
              current={path === urls.nationalOrcid[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.orcid',
                defaultMessage: 'ORCID',
              })}
            >
              <NavSubItem
                current={path === urls.nationalOrcid[lang]}
                title={intl.formatMessage({
                  id: 'app.baro-national.orcid.title',
                  defaultMessage: 'Suivi ORCID',
                })}
                asLink={<RouterLink to={urls.nationalOrcid[lang] + search} />}
              />
            </NavItem>
          )}

          <NavItem
            current={path.startsWith(`/${urls.variations[lang].split('/')[1]}`)}
            title={intl.formatMessage({
              id: 'app.header.nav.institutions',
              defaultMessage: 'Les établissements',
            })}
          >
            {!isInProduction() && (
              <NavSubItem
                current={path === urls.policy[lang]}
                title={intl.formatMessage({
                  id: 'app.header.nav.declinaisons.policy',
                  defaultMessage:
                    'Politique de science ouverte des établissements',
                })}
                asLink={<RouterLink to={urls.policy[lang] + search} />}
                display={!isInProduction()}
              />
            )}
            <NavSubItem
              current={path === urls.variations[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.declinaisons.existing',
                defaultMessage: 'Les baromètres des établissements',
              })}
              asLink={<RouterLink to={urls.variations[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.howto[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.declinaisons.howto',
                defaultMessage: 'Tutoriel pour réaliser son BSO local',
              })}
              asLink={<RouterLink to={urls.howto[lang] + search} />}
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
              current={path === urls.communication[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos.communication',
                defaultMessage: 'Communication',
              })}
              asLink={<RouterLink to={urls.communication[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.opendata[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.a-propos-opendata',
                defaultMessage: 'Données ouvertes et code source du BSO',
              })}
              asLink={<RouterLink to={urls.opendata[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.citation[lang]}
              title={intl.formatMessage({
                id: 'app.header.nav.citation',
                defaultMessage: 'Comment citer le Baromètre ?',
              })}
              asLink={<RouterLink to={urls.citation[lang] + search} />}
            />
            <NavSubItem
              current={path === urls.faq[lang]}
              title={intl.formatMessage({
                id: 'app.footer.project.text',
                defaultMessage: 'FAQ',
              })}
              asLink={<RouterLink to={urls.project[lang] + search} />}
            />
          </NavItem>
        </HeaderNav>
      </DSHeader>
    </WrapperDisplay>
  );
}
export default Header;

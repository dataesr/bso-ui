import {
  Container,
  Header as DSHeader,
  HeaderBody,
  HeaderNav,
  NavItem,
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
      <div className='brands'>
        <Container className='brands-container'>
          <a href='https://nii.ac.jp' target='_blank' rel='noreferrer'>
            <img src='/logos/nii.png' alt='National Institute of Informatics' />
          </a>
          <a href='https://rcos.nii.ac.jp' target='_blank' rel='noreferrer'>
            <img
              src='/logos/rcos.png'
              alt='Research Center for Open Science and Data Platform'
            />
          </a>
        </Container>
      </div>
      <DSHeader
        closeButtonLabel={intl.formatMessage({
          id: 'app.commons.close',
          defaultMessage: 'Fermer',
        })}
        className='josm-header'
      >
        <HeaderBody>
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
                    href='/en'
                    hrefLang={lang}
                    active={selectedLang === 'en'}
                    onClick={() => setSelectedLang('en')}
                  >
                    English
                  </ToolTranslateItem>
                  <ToolTranslateItem
                    href='/ja'
                    hrefLang={lang}
                    active={selectedLang === 'ja'}
                    onClick={() => setSelectedLang('ja')}
                  >
                    日本語
                  </ToolTranslateItem>
                </ToolTranslate>
              </ToolItem>
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <HeaderNav path={path}>
          <NavItem
            current={
              path.startsWith(urls.nationalPublications[lang])
              || path === urls.nationalThesis[lang]
            }
            title={intl.formatMessage({
              id: 'app.header.nav.baro-national-publications',
              defaultMessage: 'The publications',
            })}
            asLink={(
              <RouterLink
                to={urls.nationalPublications.tabs[0][lang] + search}
              />
            )}
          />
          <NavItem
            current={path.startsWith(urls.about[lang])}
            title={intl.formatMessage({
              id: 'app.header.nav.a-propos',
              defaultMessage: 'About',
            })}
            asLink={<RouterLink to={urls.about[lang]} />}
          />
        </HeaderNav>
      </DSHeader>
    </WrapperDisplay>
  );
}
export default Header;

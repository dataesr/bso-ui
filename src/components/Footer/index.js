import {
  Col,
  Footer as DSFooter,
  FooterBody,
  FooterBodyItem,
  FooterBottom,
  FooterCopy,
  FooterLink,
  FooterTop,
  FooterTopCategory,
  Icon as DSIcon,
  Link,
  Logo,
  Row,
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import WrapperDisplay from '../WrapperDisplay';

export default function Footer() {
  const { pathname } = useLocation();
  const intl = useIntl();

  return (
    <WrapperDisplay display={!pathname.startsWith('/integration')}>
      <DSFooter className='mt-40'>
        <FooterTop>
          <FooterTopCategory
            title={intl.formatMessage({ id: 'app.footer.links' })}
          >
            <FooterLink
              target='_blank'
              href='https://data.enseignementsup-recherche.gouv.fr/pages/explorer/?q=bso&sort=modified'
            >
              <FormattedMessage id='app.footer.link.open-data' />
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://github.com/orgs/dataesr/repositories?q=bso&type=&language=&sort='
            >
              <FormattedMessage id='app.glossary.code-source' />
            </FooterLink>
            <FooterLink
              href={intl.formatMessage({ id: 'url.about.methodology' })}
            >
              <FormattedMessage id='app.header.nav.a-propos-methodologie' />
            </FooterLink>
            <FooterLink
              href={intl.formatMessage({ id: 'app.footer.project.url' })}
            >
              <FormattedMessage id='app.footer.project.text' />
            </FooterLink>
          </FooterTopCategory>
          <FooterTopCategory
            title={intl.formatMessage({ id: 'app.footer.voir-aussi' })}
          >
            <FooterLink
              target='_blank'
              href={intl.formatMessage({ id: 'app.card.open-science.url' })}
            >
              <FormattedMessage id='app.footer.link.open-science' />
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://scanr.enseignementsup-recherche.gouv.fr/'
            >
              <FormattedMessage id='app.footer.scanr.text' />
            </FooterLink>
            <FooterLink
              target='_blank'
              href={intl.formatMessage({ id: 'app.footer.dataesr.url' })}
            >
              #dataESR
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://data.enseignementsup-recherche.gouv.fr/pages/home/'
            >
              <FormattedMessage id='app.footer.link.platform-open-data' />
            </FooterLink>
          </FooterTopCategory>
          <FooterTopCategory
            title={intl.formatMessage({ id: 'app.footer.nos-sources' })}
          >
            <FooterLink target='_blank' href='https://pubmed.ncbi.nlm.nih.gov/'>
              PubMed
            </FooterLink>
            <FooterLink target='_blank' href='https://unpaywall.org/'>
              Unpaywall
            </FooterLink>
            <FooterLink target='_blank' href='https://doaj.org/'>
              DOAJ
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://github.com/OpenAPC/openapc-de'
            >
              OpenAPC
            </FooterLink>
            <FooterLink target='_blank' href='https://clinicaltrials.gov/'>
              ClinicalTrials.org
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://www.clinicaltrialsregister.eu/'
            >
              EU Clinical Trials Register
            </FooterLink>
          </FooterTopCategory>
          <FooterTopCategory
            title={intl.formatMessage({ id: 'app.footer.nous-suivre' })}
          >
            <FooterLink
              target='_blank'
              href='https://twitter.com/sup_recherche'
            >
              <DSIcon
                className='ds-fr--v-middle'
                name='ri-twitter-fill'
                size='xl'
              >
                <span>twitter</span>
              </DSIcon>
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://fr.linkedin.com/company/enseignementsup-recherche'
            >
              <DSIcon
                className='ds-fr--v-middle'
                name='ri-linkedin-box-fill'
                size='xl'
              >
                <span>linkedin</span>
              </DSIcon>
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://www.facebook.com/enseignementsup.recherche'
            >
              <DSIcon
                className='ds-fr--v-middle'
                name='ri-facebook-box-fill'
                size='xl'
              >
                <span>facebook</span>
              </DSIcon>
            </FooterLink>
          </FooterTopCategory>
        </FooterTop>
        <FooterBody
          description={<FormattedMessage id='app.footer.description' />}
        >
          <Logo
            splitCharacter={9}
            target='_blank'
            href='https://www.enseignementsup-recherche.gouv.fr/'
          >
            {intl.formatMessage({ id: 'app.ministry' })}
          </Logo>
          <FooterBodyItem>
            <Link target='_blank' href='https://www.service-public.fr/'>
              service-public.fr
            </Link>
          </FooterBodyItem>
          <FooterBodyItem>
            <Link target='_blank' href='https://www.data.gouv.fr/fr/'>
              data.gouv.fr
            </Link>
          </FooterBodyItem>
        </FooterBody>
        <FooterBottom>
          <FooterLink
            target='_blank'
            href={intl.formatMessage({ id: 'app.footer.pnso.url' })}
          >
            <FormattedMessage id='app.footer.pnso.text' />
          </FooterLink>
          <FooterLink
            target='_blank'
            href='https://www.modernisation.gouv.fr/actualites/ouvrir-laction-publique-construisons-ensemble-le-plan-daction-gouvernement-ouvert-2021'
          >
            Plan d’Action National de la France au sein du Partenariat pour un
            Gouvernement Ouvert (PGO)
          </FooterLink>
          <FooterLink href={intl.formatMessage({ id: 'url.about.faq' })}>
            FAQ
          </FooterLink>
          <FooterCopy className='w-100'>
            <Row>
              <Col n='lg-1 md-2 sm-3 mt-auto mb-auto'>
                <img
                  className='w-100'
                  src='/logos/relance.jpg'
                  alt='plan de relance'
                />
              </Col>
              <Col n='lg-2 md-3 sm-6 mt-auto mb-auto'>
                <img
                  className='w-100'
                  src='/logos/nextgeneu_en.jpg'
                  alt="plan de relance pour l'europe"
                />
              </Col>
            </Row>
            <p className='float-right'>{`v${process.env.REACT_APP_VERSION}`}</p>
            <p>
              {intl.formatMessage({ id: 'app.footer.licence.usage' })}
              {' '}
              <a
                href={intl.formatMessage({
                  id: 'app.footer.etalab-licence.url',
                })}
                target='_blank'
                rel='noreferrer'
              >
                licence etalab-2.0
              </a>
            </p>
          </FooterCopy>
        </FooterBottom>
      </DSFooter>
      <div className='overlay z-3600' />
    </WrapperDisplay>
  );
}

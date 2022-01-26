import {
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
} from '@dataesr/react-dsfr';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import WrapperDisplay from '../WrapperDisplay';

export default function Footer() {
  const { pathname } = useLocation();

  return (
    <WrapperDisplay display={!pathname.startsWith('/integration')}>
      <DSFooter>
        <FooterTop>
          <FooterTopCategory title={<FormattedMessage id='app.footer.links' />}>
            <FooterLink
              target='_blank'
              href='https://github.com/orgs/dataesr/repositories?q=bso&type=&language=&sort='
            >
              Github
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://hal.archives-ouvertes.fr/hal-02141819v1'
            >
              <FormattedMessage id='app.header.nav.a-propos-methodologie' />
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://data.enseignementsup-recherche.gouv.fr/explore/dataset/open-access-monitor-france/information/?disjunctive.oa_host_type&disjunctive.year'
            >
              <FormattedMessage id='app.footer.link.open-data' />
            </FooterLink>
          </FooterTopCategory>
          <FooterTopCategory
            title={<FormattedMessage id='app.footer.voir-aussi' />}
          >
            <FooterLink
              target='_blank'
              href='https://www.ouvrirlascience.fr/open-science/'
            >
              <FormattedMessage id='app.footer.link.open-science' />
            </FooterLink>
            <FooterLink
              target='_blank'
              href='https://scanr.enseignementsup-recherche.gouv.fr/'
            >
              <FormattedMessage id='app.footer.link.scanr' />
            </FooterLink>
            <FooterLink target='_blank' href='https://data.esr.gouv.fr/FR/'>
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
            title={<FormattedMessage id='app.footer.nos-sources' />}
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
            title={<FormattedMessage id='app.footer.nous-suivre' />}
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
            splitCharacter={10}
            target='_blank'
            href='https://www.enseignementsup-recherche.gouv.fr/'
          >
            Ministère de l'enseignement supérieur, de la recherche et de
            l'innovation
          </Logo>
          <FooterBodyItem>
            <Link target='_blank' href='https://service-public.fr'>
              service-public.fr
            </Link>
          </FooterBodyItem>
          <FooterBodyItem>
            <Link target='_blank' href='https://data.gouv.fr'>
              data.gouv.fr
            </Link>
          </FooterBodyItem>
        </FooterBody>
        <FooterBottom>
          <FooterLink
            target='_blank'
            href='https://www.ouvrirlascience.fr/wp-content/uploads/2021/06/Deuxieme-Plan-National-Science-Ouverte_2021-2024.pdf'
          >
            Deuxième Plan National pour la Science Ouverte
          </FooterLink>
          <FooterLink
            target='_blank'
            href='https://www.modernisation.gouv.fr/actualites/ouvrir-laction-publique-construisons-ensemble-le-plan-daction-gouvernement-ouvert-2021'
          >
            Plan d’Action National de la France au sein du Partenariat pour un
            Gouvernement Ouvert (PGO)
          </FooterLink>
          <FooterLink href='/a-propos/faq'>FAQ</FooterLink>
          <FooterCopy>
            <p>
              <FormattedMessage id='app.footer.licence' />
              {' '}
              <a
                href='https://github.com/etalab/licence-ouverte/blob/master/LO.md'
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

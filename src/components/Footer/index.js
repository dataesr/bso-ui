import {
  Footer as DSFooter,
  FooterBody,
  FooterBodyItem,
  FooterBottom,
  FooterLink,
  FooterTop,
  FooterTopCategory,
  Icon as DSIcon,
  Link,
  Logo,
} from '@dataesr/react-dsfr';
import React from 'react';

export default function Footer() {
  return (
    <DSFooter>
      <FooterTop>
        <FooterTopCategory title='Liens'>
          <FooterLink target='_blank' href='https://github.com/dataesr/bso-ui'>
            Github
          </FooterLink>
          <FooterLink
            target='_blank'
            href='https://hal.archives-ouvertes.fr/hal-02141819v1'
          >
            Méthodologie
          </FooterLink>
          <FooterLink
            target='_blank'
            href='https://data.enseignementsup-recherche.gouv.fr/explore/dataset/open-access-monitor-france/information/?disjunctive.oa_host_type&disjunctive.year'
          >
            Données ouvertes
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title='Voir aussi'>
          <FooterLink
            target='_blank'
            href='https://www.ouvrirlascience.fr/open-science/'
          >
            Ouvrir la science
          </FooterLink>
          <FooterLink target='_blank' href='https://data.esr.gouv.fr/FR/'>
            #dataESR
          </FooterLink>
          <FooterLink
            target='_blank'
            href='https://scanr.enseignementsup-recherche.gouv.fr/'
          >
            scanR, le moteur de la recherche et de l'innovation
          </FooterLink>
          <FooterLink
            target='_blank'
            href='https://data.enseignementsup-recherche.gouv.fr/pages/home/'
          >
            Plateforme Open Data
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title='Nos sources'>
          <FooterLink target='_blank' href='https://pubmed.ncbi.nlm.nih.gov/'>
            Pubmed
          </FooterLink>
          <FooterLink target='_blank' href='https://unpaywall.org/'>
            Unpaywall
          </FooterLink>
        </FooterTopCategory>
        <FooterTopCategory title='Nous suivre sur les réseaux'>
          <FooterLink href='https://twitter.com/sup_recherche'>
            <DSIcon
              className='ds-fr--v-middle'
              name='ri-twitter-fill'
              size='xl'
            >
              <span>twitter</span>
            </DSIcon>
          </FooterLink>
          <FooterLink href='https://fr.linkedin.com/company/enseignementsup-recherche'>
            <DSIcon
              className='ds-fr--v-middle'
              name='ri-linkedin-box-fill'
              size='xl'
            >
              <span>linkedin</span>
            </DSIcon>
          </FooterLink>
          <FooterLink href='https://www.facebook.com/enseignementsup.recherche'>
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
        description={
          "Le Baromètre français de la Science Ouverte. Mesurer l'évolution de l'accès ouvert aux publications en France à partir de données fiables, ouvertes et maîtrisées"
        }
      >
        <Logo>Ministère de l'enseignement supérieur et de la recherche</Logo>
        <FooterBodyItem>
          <Link href='https://service-public.fr'>service-public.fr</Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link href='https://data.gouv.fr'>data.gouv.fr</Link>
        </FooterBodyItem>
      </FooterBody>
      <FooterBottom>
        <FooterLink
          target='_blank'
          href='https://www.opengovpartnership.org/wp-content/uploads/2018/04/France_Action-Plan_2018-2020.pdf'
        >
          Plan National pour la Science Ouverte
        </FooterLink>
        <FooterLink
          target='_blank'
          href='https://cache.media.enseignementsup-recherche.gouv.fr/file/Actus/67/2/PLAN_NATIONAL_SCIENCE_OUVERTE_978672.pdf'
        >
          Plan d’Action National de la France au sein du Partenariat pour un
          Gouvernement Ouvert (PGO)
        </FooterLink>
        <FooterLink href='/a-propos/foire-aux-questions'>FAQ</FooterLink>
      </FooterBottom>
    </DSFooter>
  );
}

import { chartOptions } from './chartOptions';

export const graphIds = Object.keys(chartOptions);

export const domains = ['health', ''];
export const studiesTypes = ['Interventional', 'Observational', ''];

export const mobileButtonLabel = {
  fr: {
    '/sante/publications/disciplines': 'app.publi.disciplines',
    '/sante/publications/affiliations': 'app.publi.affiliations',
    '/sante/publications/editeurs': 'app.publi.editeurs',
    '/sante/publications/general': 'app.publi.general',
    '/sante/publications/archives': 'app.publi.archives',
    '/sante/essais-cliniques': 'app.publi.general',
    '/publications/disciplines': 'app.publi.disciplines',
    '/publications/editeurs': 'app.publi.editeurs',
    '/publications/general': 'app.publi.general',
    '/publications/archives': 'app.publi.archives',
    '/sante/essais-cliniques/general': 'app.health-interventional.general',
    '/sante/essais-cliniques/caracteristiques':
      'app.health-interventional.caracteristiques',
    '/sante/essais-cliniques/promoteurs':
      'app.health-interventional.promoteurs',
    '/sante/essais-cliniques/resultats': 'app.health-interventional.resultats',
    '/sante/etudes-observationnelles/general':
      'app.health-observational.general',
    '/sante/etudes-observationnelles/caracteristiques':
      'app.health-observational.caracteristiques',
    '/sante/etudes-observationnelles/promoteurs':
      'app.health-observational.promoteurs',
    '/sante/etudes-observationnelles/resultats':
      'app.health-observational.resultats',
    '/donnees-de-la-recherche/general': 'app.data.general',
    '/donnees-de-la-recherche/disciplines': 'app.data.disciplines',
    '/donnees-de-la-recherche/editeurs': 'app.data.editeurs',
    '/theses-de-doctorat/general': 'app.thesis.general',
    '/orcid/general': 'app.orcid.general',
  },
  en: {
    '/health/publications/fields': 'app.publi.disciplines',
    '/health/publications/affiliations': 'app.publi.affiliations',
    '/health/publications/repositories': 'app.publi.archives',
    '/health/publications/publishers': 'app.publi.editeurs',
    '/health/publications/general': 'app.publi.general',
    '/publications/fields': 'app.publi.disciplines',
    '/publications/repositories': 'app.publi.archives',
    '/publications/publishers': 'app.publi.editeurs',
    '/publications/general': 'app.publi.general',
    '/health/clinical-trials/general': 'app.health-interventional.general',
    '/health/clinical-trials/caracteristiques':
      'app.health-interventional.caracteristiques',
    '/health/clinical-trials/promoteurs':
      'app.health-interventional.promoteurs',
    '/health/clinical-trials/resultats': 'app.health-interventional.resultats',
    '/health/observational-studies/general': 'app.health-observational.general',
    '/health/observational-studies/caracteristiques':
      'app.health-observational.caracteristiques',
    '/health/observational-studies/promoteurs':
      'app.health-observational.promoteurs',
    '/health/observational-studies/resultats':
      'app.health-observational.resultats',
    '/research-data/general': 'app.data.general',
    '/research-data/disciplines': 'app.data.disciplines',
    '/research-data/publishers': 'app.data.editeurs',
    '/thesis/general': 'app.thesis.general',
    '/orcid/general': 'app.orcid.general',
  },
  ja: {
    '/health/publications/fields': 'app.publi.disciplines',
    '/health/publications/affiliations': 'app.publi.affiliations',
    '/health/publications/repositories': 'app.publi.archives',
    '/health/publications/publishers': 'app.publi.editeurs',
    '/health/publications/general': 'app.publi.general',
    '/publications/fields': 'app.publi.disciplines',
    '/publications/repositories': 'app.publi.archives',
    '/publications/publishers': 'app.publi.editeurs',
    '/publications/general': 'app.publi.general',
    '/health/clinical-trials/general': 'app.health-interventional.general',
    '/health/clinical-trials/caracteristiques':
      'app.health-interventional.caracteristiques',
    '/health/clinical-trials/promoteurs':
      'app.health-interventional.promoteurs',
    '/health/clinical-trials/resultats': 'app.health-interventional.resultats',
    '/health/observational-studies/general': 'app.health-observational.general',
    '/health/observational-studies/caracteristiques':
      'app.health-observational.caracteristiques',
    '/health/observational-studies/promoteurs':
      'app.health-observational.promoteurs',
    '/health/observational-studies/resultats':
      'app.health-observational.resultats',
    '/research-data/general': 'app.data.general',
    '/research-data/disciplines': 'app.data.disciplines',
    '/research-data/publishers': 'app.data.editeurs',
    '/thesis/general': 'app.thesis.general',
    '/orcid/general': 'app.orcid.general',
  },
};

export const documentTitles = {
  '/': 'app.header.title',
  '/a-propos/foire-aux-questions': 'app.faq',
  '/about/questions': 'app.faq',
  '/a-propos/notes-flash': 'app.header.nav.a-propos-notes-flash',
  '/about/flash-notes': 'app.header.nav.a-propos-notes-flash',
  '/publications/general': 'app.publications.document.title',
  '/publications/disciplines': 'app.publications.document.title',
  '/publications/editeurs': 'app.publications.document.title',
  '/publications/archives': 'app.publications.document.title',
  '/sante/publications/general': 'app.sante.publications.document.title',
  '/health/publications/general': 'app.sante.publications.document.title',
  '/sante/publications/disciplines': 'app.sante.publications.document.title',
  '/health/publications/disciplines': 'app.sante.publications.document.title',
  '/sante/publications/editeurs': 'app.sante.publications.document.title',
  '/health/publications/editeurs': 'app.sante.publications.document.title',
  '/sante/publications/archives': 'app.sante.publications.document.title',
  '/health/publications/archives': 'app.sante.publications.document.title',
  '/sante/publications/affiliations': 'app.sante.publications.document.title',
  '/health/publications/affiliations': 'app.sante.publications.document.title',
  '/sante/essais-cliniques/general': 'app.sante.essais.document.title',
  '/health/clinical-trials/general': 'app.sante.essais.document.title',
  '/sante/essais-cliniques/caracteristiques': 'app.sante.essais.document.title',
  '/health/clinical-trials/characteristics': 'app.sante.essais.document.title',
  '/sante/essais-cliniques/promoteurs': 'app.sante.essais.document.title',
  '/health/clinical-trials/lead-sponsors': 'app.sante.essais.document.title',
  '/sante/essais-cliniques/resultats': 'app.sante.essais.document.title',
  '/health/clinical-trials/results': 'app.sante.essais.document.title',
  '/sante/etudes-observationnelles/general': 'app.sante.studies.document.title',
  '/health/observational-studies/general': 'app.sante.studies.document.title',
  '/sante/etudes-observationnelles/caracteristiques':
    'app.sante.studies.document.title',
  '/health/observational-studies/characteristics':
    'app.sante.studies.document.title',
  '/sante/etudes-observationnelles/promoteurs':
    'app.sante.studies.document.title',
  '/health/observational-studies/lead-sponsors':
    'app.sante.studies.document.title',
  '/sante/etudes-observationnelles/resultats':
    'app.sante.studies.document.title',
  '/health/observational-studies/results': 'app.sante.studies.document.title',
  '/health/obstervational-studies/general': 'app.sante.studies.document.title',
  '/a-propos/methodologie': 'app.header.nav.a-propos-methodologie',
  '/about/methodology': 'app.header.nav.a-propos-methodologie',
  '/about/glossary': 'app.header.nav.a-propos-glossaire',
  '/a-propos/glossaire': 'app.header.nav.a-propos-glossaire',
  '/sante': 'app.sante.document.title',
  '/health': 'app.sante.document.title',
  '/donnees-de-la-recherche': 'app.data.document.title',
  '/donnees-de-la-recherche/general': 'app.data.document.title',
  '/donnees-de-la-recherche/disciplines': 'app.data.document.title',
  '/research-data': 'app.data.document.title',
  '/research-data/general': 'app.data.document.title',
  '/research-data/disciplines': 'app.data.document.title',
  '/theses-de-doctorat/general': 'app.thesis.document.title',
  '/thesis/general': 'app.thesis.document.title',
  '/orcid/general': 'app.orcid.document.title',
};

export const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'g',
  'h',
  'l',
  'm',
  'o',
  'p',
  'r',
  's',
  't',
  'u',
];

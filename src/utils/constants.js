import { chartOptions } from './chartOptions';

export const graphIds = Object.keys(chartOptions);

export const domains = ['health', ''];
export const studiesTypes = ['Interventional', 'Observational'];

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
  },
  en: {
    '/health/publications/disciplines': 'app.publi.disciplines',
    '/health/publications/affiliations': 'app.publi.affiliations',
    '/health/publications/archives': 'app.publi.archives',
    '/health/publications/editeurs': 'app.publi.editeurs',
    '/health/publications/general': 'app.publi.general',
    '/publications/disciplines': 'app.publi.disciplines',
    '/publications/archives': 'app.publi.archives',
    '/publications/editeurs': 'app.publi.editeurs',
    '/publications/general': 'app.publi.general',
  },
};

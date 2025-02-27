export const ES_API_URL = process.env.REACT_APP_ES_API_URL_PUBLICATIONS;
export const ES_DATACITE_API_URL = process.env.REACT_APP_ES_API_URL_DATACITE;
export const ES_ORCID_API_URL = process.env.REACT_APP_ES_API_URL_ORCID;
export const ES_STUDIES_API_SOURCES = JSON.parse(
  process.env.REACT_APP_ES_API_SOURCES_STUDIES,
);
export const ES_STUDIES_API_URL = process.env.REACT_APP_ES_API_URL_STUDIES;

export const HEADERS = {
  headers: {
    Authorization: 'Basic QlNPOnZuODRxOVhlZjlVN3BtVQ==',
    'Content-Type': 'application/json',
  },
};

export const IS_TEST = false;

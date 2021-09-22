import { getPublicationYearFromObservationSnap } from './helpers';

/**
 *
 * @param key
 * @param domain
 * @param parameters
 * @returns {*|{}}
 */
export default function getFetchOptions(key, domain, ...parameters) {
  const allOptions = {
    publicationRate: ([
      observationSnap,
      needlePublisher = '*',
      oaHostType = '*',
    ]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            { wildcard: { 'publisher.keyword': needlePublisher } },
            {
              wildcard: {
                [`oa_details.${observationSnap}.oa_host_type`]: oaHostType,
              },
            },
          ],
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    publicationRateDiscipline: ([observationSnap, disciplineField]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
          ],
        },
      },
      aggs: {
        by_discipline: {
          terms: {
            field: `${disciplineField}.keyword`,
            size: 25,
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    publicationRateAffiliation: ([observationSnap, affiliationField]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
          ],
        },
      },
      aggs: {
        by_affiliation: {
          terms: {
            field: `${affiliationField}.keyword`,
            size: 25,
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    publicationRateRangUtile: ([observationSnap]) => ({
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_author_useful_rank_fr: {
              terms: {
                field: 'author_useful_rank_fr',
              },
              aggs: {
                by_is_oa: {
                  terms: {
                    field: `oa_details.${observationSnap}.is_oa`,
                  },
                },
              },
            },
          },
        },
      },
    }),
    publicationRatePays: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { term: { author_useful_rank_fr: true } },
          ],
        },
      },
      aggs: {
        by_country: {
          terms: {
            field: 'detected_countries.keyword',
            size: 21,
          },
          aggs: {
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    repositoriesHisto: ([observationSnap]) => ({
      size: 0,
      aggs: {
        by_repository: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            exclude: 'pdfs.semanticscholar.org',
            size: 12,
          },
          aggs: {
            by_year: { terms: { field: 'year' } },
          },
        },
      },
    }),
    couvertureHAL: ([observationSnap, needleRepository = '*']) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'repository',
              },
            },
            {
              wildcard: {
                [`oa_details.${observationSnap}.repositories.keyword`]:
                  needleRepository,
              },
            },
          ],
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
        },
      },
    }),
    disciplinesHisto: ([observationSnap, disciplineField]) => ({
      size: 0,
      aggs: {
        by_discipline: {
          terms: {
            field: `${disciplineField}.keyword`,
            size: 25,
          },
          aggs: {
            by_year: {
              terms: {
                field: 'year',
              },
              aggs: {
                by_is_oa: {
                  terms: {
                    field: `oa_details.${observationSnap}.is_oa`,
                  },
                },
              },
            },
          },
        },
      },
    }),
    disciplinesVoies: ([observationSnap, disciplineField]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
          ],
        },
      },
      aggs: {
        by_discipline: {
          terms: {
            field: `${disciplineField}.keyword`,
            size: 25,
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${observationSnap}.oa_host_type.keyword`,
              },
            },
          },
        },
      },
    }),
    disciplinesVoiesEvolutions: ([observationSnap, disciplineField]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
          ],
        },
      },
      aggs: {
        by_discipline: {
          terms: {
            field: `${disciplineField}.keyword`,
            size: 25,
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
            },
          },
        },
      },
    }),
    publication: () => ({
      size: 0,
      aggs: {
        publication_count: {
          cardinality: {
            field: 'doi.keyword',
            precision_threshold: 1000,
          },
        },
      },
    }),
    publisher: () => ({
      size: 0,
      aggs: {
        publisher_count: {
          cardinality: {
            field: 'publisher.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    publishersList: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'publisher',
              },
            },
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
            size: 10000,
          },
        },
      },
    }),
    publishersTypesHisto: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'publisher',
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    publishersPolitiqueHisto: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { exists: { field: `oa_details.${observationSnap}` } },
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    publishersPolitiqueBulle: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { exists: { field: `oa_details.${observationSnap}` } },
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
            },
          },
        },
      },
    }),
    publishersLicence: ([observationSnap, needlePublisher = '*']) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'publisher',
              },
            },
            { wildcard: { 'publisher.keyword': needlePublisher } },
          ],
        },
      },
      aggs: {
        by_is_oa: {
          terms: {
            field: `oa_details.${observationSnap}.is_oa`,
          },
          aggs: {
            by_licence: {
              terms: {
                field: `oa_details.${observationSnap}.licence_publisher.keyword`,
              },
            },
          },
        },
        by_publisher: {
          terms: {
            field: 'publisher.keyword',
          },
          aggs: {
            by_licence: {
              terms: {
                field: `oa_details.${observationSnap}.licence_publisher.keyword`,
              },
            },
          },
        },
      },
    }),
    apcYear: ([observationSnap, needle]) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ wildcard: { 'publisher.keyword': needle } }],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
              aggs: {
                apc: {
                  sum: {
                    field: 'amount_apc_EUR',
                  },
                },
              },
            },
          },
        },
      },
    }),
    apcHistogram: ([observationSnap, needle]) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ wildcard: { 'publisher.keyword': needle } }],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
              aggs: {
                apc: {
                  histogram: {
                    field: 'amount_apc_EUR',
                    interval: 250,
                    hard_bounds: {
                      min: 0,
                      max: 6000,
                    },
                    extended_bounds: {
                      min: 0,
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    apcPercentile: ([observationSnap, needle]) => ({
      size: 0,
      query: {
        bool: {
          filter: [{ wildcard: { 'publisher.keyword': needle } }],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_colors: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors.keyword`,
              },
              aggs: {
                apc: {
                  percentiles: {
                    field: 'amount_apc_EUR',
                  },
                },
              },
            },
          },
        },
      },
    }),
    predatory: () => ({
      size: 0,
      aggs: {
        by_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_predatory: {
              terms: {
                field: 'predatory_journal',
              },
            },
          },
        },
      },
    }),
    journal: () => ({
      size: 0,
      aggs: {
        journal_count: {
          cardinality: {
            field: 'journal_issn_l.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    repository: () => ({
      size: 0,
      aggs: {
        repositories_count: {
          cardinality: {
            field: 'oa_details.2021Q2.repositories.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    repositoriesList: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'repository',
              },
            },
          ],
        },
      },
      aggs: {
        by_repository: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            size: 10000,
          },
        },
      },
    }),
    obsDates: () => ({
      size: 0,
      aggs: {
        observation_dates_count: {
          cardinality: {
            field: 'observation_dates.keyword',
            precision_threshold: 1,
          },
        },
      },
    }),
    observationSnaps: () => ({
      size: 0,
      aggs: {
        observation_dates: {
          terms: { field: 'observation_dates.keyword', size: 100 },
        },
      },
    }),
    interventional: () => ({
      size: 0,
      aggs: {
        study_type: {
          terms: { field: 'study_type.keyword' },
        },
      },
    }),
    observational: () => ({
      size: 0,
      aggs: {
        study_type: {
          terms: { field: 'study_type.keyword' },
        },
      },
    }),
    studiesDynamiqueOuverture: ([studyType]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                'study_type.keyword': studyType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
          },
          aggs: {
            by_sponsor_type: {
              terms: {
                field: 'lead_sponsor_type.keyword',
              },
              aggs: {
                by_has_result: {
                  terms: {
                    field: 'has_results_or_publications',
                  },
                },
              },
            },
          },
        },
      },
    }),
    publiCardData: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
            { exists: { field: `oa_details.${observationSnap}` } },
          ],
        },
      },
      aggs: {
        count_publications: {
          cardinality: {
            field: 'doi.keyword',
            precision_threshold: 100,
          },
        },
        by_is_oa: {
          terms: {
            field: `oa_details.${observationSnap}.is_oa`,
          },
        },
        by_oa_colors: {
          terms: {
            field: `oa_details.${observationSnap}.oa_colors.keyword`,
          },
          aggs: {
            apc: {
              sum: {
                field: 'amount_apc_EUR',
              },
            },
          },
        },
        by_oa_colors_with_priority_to_publisher: {
          terms: {
            field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
          },
        },
        by_repositories: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            size: 15,
          },
        },
        by_lang: {
          terms: {
            field: 'lang.keyword',
          },
        },
        by_author_useful_rank: {
          terms: {
            field: 'author_useful_rank_countries.keyword',
            size: 2,
          },
        },
      },
    }),
    oaHostType: ([lastObservationSnap]) => ({
      size: 0,
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${lastObservationSnap}.oa_host_type.keyword`,
              },
            },
          },
        },
      },
    }),
    declarationRate: ([lastObservationSnap]) => ({
      size: 0,
      aggs: {
        by_is_oa: {
          terms: {
            field: `oa_details.${lastObservationSnap}.is_oa`,
          },
          aggs: {
            by_oa_host_type: {
              terms: {
                field: `oa_details.${lastObservationSnap}.oa_host_type.keyword`,
              },
              aggs: {
                by_grant_agency: {
                  terms: {
                    field: 'grants.agency.keyword',
                  },
                },
              },
            },
          },
        },
      },
    }),
    openingRate: ([observationSnap, queryFilter]) => ({
      size: 0,
      query: {
        bool: {
          filter: queryFilter,
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field: 'year',
          },
          aggs: {
            by_has_grant: {
              terms: {
                field: 'has_grant',
              },
              aggs: {
                by_is_oa: {
                  terms: {
                    field: `oa_details.${observationSnap}.is_oa`,
                  },
                },
              },
            },
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
          },
        },
      },
    }),
    allAgencies: ([lastObservationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(
                  lastObservationSnap,
                ),
              },
            },
            { exists: { field: `oa_details.${lastObservationSnap}` } },
          ],
        },
      },
      aggs: {
        by_agency: {
          terms: {
            field: 'grants.agency.keyword',
          },
        },
      },
    }),
    openingType: ([lastObservationSnap, field, splitField]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(
                  lastObservationSnap,
                ),
              },
            },
          ],
        },
      },
      aggs: {
        by_is_oa: {
          terms: {
            field: `oa_details.${lastObservationSnap}.${field}`,
            order: { _key: 'asc' },
          },
          aggs: {
            by_publication_split: {
              terms: {
                field: `${splitField}`,
              },
            },
          },
        },
      },
    }),
    affiliationsList: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                year: getPublicationYearFromObservationSnap(observationSnap),
              },
            },
          ],
        },
      },
      aggs: {
        by_affiliation: {
          terms: {
            field: 'french_affiliations_types.keyword',
            size: 10000,
          },
        },
      },
    }),
    studiesCharacteristicWhenEvolution: ([studyType]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                'study_type.keyword': studyType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
          },
          aggs: {
            by_submission_temporality: {
              terms: {
                field: 'submission_temporality.keyword',
              },
            },
          },
        },
      },
    }),
    studiesCharacteristicWhenRepartition: ([studyType]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                'study_type.keyword': studyType,
              },
            },
            {
              range: {
                delay_submission_start: {
                  from: -720,
                  to: 720,
                },
              },
            },
          ],
        },
      },
      aggs: {
        delay_submission_start: {
          histogram: {
            field: 'delay_submission_start',
            interval: 30,
          },
        },
      },
    }),
  };
  const queryResponse = allOptions[key](parameters) || {};
  if (!queryResponse.query?.bool?.filter) {
    queryResponse.query = { bool: { filter: [] } };
  }
  if (domain) {
    queryResponse.query.bool.filter.push({
      term: { 'domains.keyword': domain },
    });
  }
  return queryResponse;
}

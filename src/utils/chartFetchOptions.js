import {
  getPublicationYearFromObservationSnap,
  getURLSearchParams,
} from './helpers';

/**
 *
 * @param key
 * @param domain
 * @param parameters
 * @returns {*|{}}
 */
export default function getFetchOptions({
  key,
  domain = null,
  parameters = [],
}) {
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
            {
              wildcard: { 'publisher_dissemination.keyword': needlePublisher },
            },
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
      query: {
        bool: {
          filter: [
            {
              range: {
                year: {
                  gte:
                    getPublicationYearFromObservationSnap(observationSnap) - 4,
                },
              },
            },
          ],
        },
      },
      aggs: {
        by_repository: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            exclude: ['pdfs.semanticscholar.org', 'edpsciences.org'],
            size: 150,
          },
          aggs: {
            by_year: { terms: { field: 'year' } },
          },
        },
      },
    }),
    couvertureHAL: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                [`oa_details.${observationSnap}.repositories.keyword`]: 'HAL',
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
    couvertureAllRepo: ([observationSnap]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                [`oa_details.${observationSnap}.oa_host_type`]: 'repository',
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
    sponsorsTypesList: ([studyType]) => ({
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
        by_sponsor_type: {
          terms: {
            field: 'lead_sponsor_type.keyword',
            size: 10000,
          },
        },
      },
    }),
    sponsorsList: ([studyType, yearMin, yearMax]) => ({
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
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              range: {
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
          ],
        },
      },
      aggs: {
        by_sponsor: {
          terms: {
            field: 'lead_sponsor.keyword',
            size: 50,
          },
        },
      },
    }),
    publisher: () => ({
      size: 0,
      aggs: {
        publisher_count: {
          cardinality: {
            field: 'publisher_dissemination.keyword',
            precision_threshold: 10,
          },
        },
      },
    }),
    disciplinesList: ([observationSnap, disciplineField]) => ({
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
            field: disciplineField,
            size: 30,
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
          ],
        },
      },
      aggs: {
        by_publisher: {
          terms: {
            field: 'publisher_dissemination.keyword',
            exclude: ['Research Square'],
            size: 200,
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
            {
              term: {
                'genre.keyword': 'journal-article',
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
            field: 'publisher_dissemination.keyword',
            exclude: ['Cold Spring Harbor Laboratory', 'Research Square'],
            size: 25,
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
            field: 'publisher_dissemination.keyword',
            exclude: ['Cold Spring Harbor Laboratory', 'Research Square'],
            size: 20,
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
            {
              wildcard: { 'publisher_dissemination.keyword': needlePublisher },
            },
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
            field: 'publisher_dissemination.keyword',
            size: 25,
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
          filter: [{ wildcard: { 'publisher_dissemination.keyword': needle } }],
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
          filter: [{ wildcard: { 'publisher_dissemination.keyword': needle } }],
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
          filter: [{ wildcard: { 'publisher_dissemination.keyword': needle } }],
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
                field: 'journal_or_publisher_in_bealls_list',
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
    repository: ([observationSnap]) => ({
      size: 0,
      aggs: {
        repositories_count: {
          cardinality: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
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
            exclude: ['pdfs.semanticscholar.org', 'edpsciences.org'],
            size: 25,
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
    studiesDynamiqueSponsor: ([studyType, yearMin, yearMax]) => ({
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
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              range: {
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
          ],
        },
      },
      aggs: {
        by_sponsor: {
          terms: {
            field: 'lead_sponsor.keyword',
            size: 50,
          },
          aggs: {
            by_type: {
              terms: {
                field: 'lead_sponsor_type.keyword',
              },
              aggs: {
                by_has_result: {
                  terms: {
                    field: 'has_results_or_publications',
                    missing: false,
                  },
                },
              },
            },
          },
        },
      },
    }),
    studiesDynamiqueOuverture: ([studyType, yearMin, yearMax]) => ({
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
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              range: {
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
          ],
        },
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
                missing: false,
              },
            },
          },
        },
      },
    }),
    studiesDynamiqueOuvertureSponsor: ([
      studyType,
      sponsor,
      yearMin,
      yearMax,
    ]) => ({
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
              wildcard: {
                'lead_sponsor.keyword': sponsor,
              },
            },
            {
              range: {
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
            {
              term: {
                'status.keyword': 'Completed',
              },
            },
          ],
        },
      },
      aggs: {
        by_has_result: {
          terms: {
            field: 'has_results_or_publications',
            missing: false,
          },
        },
      },
    }),
    studiesResultsTypeDiffusion: ([
      studyType,
      sponsorType,
      yearMin,
      yearMax,
    ]) => ({
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
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              range: {
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
            {
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_has_result: {
          terms: {
            field: 'has_results',
            missing: false,
          },
          aggs: {
            by_has_publications_result: {
              terms: {
                field: 'has_publications_result',
                missing: false,
              },
            },
          },
        },
      },
    }),
    studiesResultsTypeDiffusionTypeIntervention: ([
      studyType,
      sponsorType,
      yearMin,
      yearMax,
    ]) => ({
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
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
            {
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_intervention_type: {
          terms: {
            field: 'intervention_type.keyword',
            size: 30,
          },
          aggs: {
            by_has_result: {
              terms: {
                field: 'has_results',
                missing: false,
              },
              aggs: {
                by_has_publications_result: {
                  terms: {
                    field: 'has_publications_result',
                    missing: false,
                  },
                },
              },
            },
          },
        },
      },
    }),
    studiesResultsPlanPartage: ([studyType, sponsorType]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
            size: 30,
          },
          aggs: {
            by_ipd: {
              terms: {
                field: 'ipd_sharing.keyword',
                missing: 'NA',
              },
            },
          },
        },
      },
    }),
    studiesPromoteursImpactPaysLeadSponsor: ([studyType]) => ({
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
              term: {
                'status.keyword': 'Completed',
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_completion_year',
            size: 30,
          },
          aggs: {
            by_fr_only: {
              terms: {
                field: 'french_location_only',
              },
              aggs: {
                by_sponsor_type: {
                  terms: {
                    field: 'lead_sponsor_type.keyword',
                  },
                  aggs: {
                    by_has_result_or_publi: {
                      terms: {
                        field: 'has_results_or_publications',
                        missing: false,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    studiesPromoteursImpactPays: ([studyType, sponsorType]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
            {
              term: {
                'status.keyword': 'Completed',
              },
            },
          ],
        },
      },
      aggs: {
        by_country: {
          terms: {
            field: 'location_country.keyword',
            size: 11,
          },
          aggs: {
            by_has_result_or_publi: {
              terms: {
                field: 'has_results_or_publications',
                missing: false,
              },
            },
          },
        },
      },
    }),
    studiesResultsPublicationsOa: ([studyType, sponsorType]) => ({
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
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_completion_year',
            size: 30,
          },
          aggs: {
            by_has_publications: {
              terms: {
                field: 'has_publications_result',
                missing: false,
              },
              aggs: {
                by_oa: {
                  terms: {
                    field: 'publication_access',
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
        by_journal_article: {
          filter: {
            term: {
              'genre.keyword': 'journal-article',
            },
          },
          aggs: {
            by_oa_colors_with_priority_to_publisher: {
              terms: {
                field: `oa_details.${observationSnap}.oa_colors_with_priority_to_publisher.keyword`,
              },
            },
          },
        },
        by_repositories: {
          terms: {
            field: `oa_details.${observationSnap}.repositories.keyword`,
            size: 15,
          },
        },
        by_oa_host_type: {
          terms: {
            field: `oa_details.${observationSnap}.oa_host_type.keyword`,
          },
        },
        by_genre: {
          terms: {
            field: 'genre.keyword',
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
    oaHostType: ([
      lastObservationSnap,
      field = 'year',
      minPublicationDate = '2013',
      size = 10,
    ]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              range: {
                year: {
                  gte: minPublicationDate,
                  lte: getPublicationYearFromObservationSnap(
                    lastObservationSnap,
                  ),
                },
              },
            },
          ],
        },
      },
      aggs: {
        by_publication_year: {
          terms: {
            field,
            size,
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
    openingRateGrant: ([observationSnap, queryFilter]) => ({
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
            by_is_oa: {
              terms: {
                field: `oa_details.${observationSnap}.is_oa`,
              },
            },
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
    studiesTrajectoires: ([studyType, yearMin, yearMax]) => ({
      size: 0,
      query: {
        bool: {
          filter: [
            {
              terms: {
                'lead_sponsor_type.keyword': ['academique', 'industriel'],
              },
            },
            {
              term: {
                'study_type.keyword': studyType,
              },
            },
            {
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              range: {
                study_completion_year: {
                  gte: yearMin,
                  lte: yearMax,
                },
              },
            },
          ],
        },
      },
      aggs: {
        by_status: {
          terms: {
            field: 'status_simplified.keyword',
          },
          aggs: {
            by_has_results: {
              terms: {
                field: 'has_results_or_publications',
                missing: false,
              },
              aggs: {
                by_has_publications_result: {
                  terms: {
                    field: 'has_publications_result',
                    missing: false,
                  },
                  aggs: {
                    by_has_publication_oa: {
                      terms: {
                        field: 'has_publication_oa',
                        missing: false,
                      },
                    },
                  },
                },
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
    studiesCaracteristiquesQuandEvolution: ([studyType, sponsorType]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
            size: 25,
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
    studiesCaracteristiquesQuandRepartition: ([
      delayField,
      studyType,
      sponsorType,
    ]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        delay_submission_start: {
          histogram: {
            field: delayField,
            interval: 30,
          },
        },
      },
    }),
    studiesCaracteristiquesQuandDistribution: ([
      delayField,
      studyType,
      sponsorType,
    ]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
            size: 20,
          },
          aggs: {
            delay_submission_start_perc: {
              percentiles: {
                field: delayField,
              },
            },
          },
        },
      },
    }),
    studiesCaracteristiquesDureeChartNombre: ([studyType, sponsorType]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
            {
              term: {
                'status.keyword': 'Completed',
              },
            },
            {
              range: {
                delay_start_completion: {
                  gte: 0,
                },
              },
            },
          ],
        },
      },
      aggs: {
        delay_start_completion: {
          histogram: {
            field: 'delay_start_completion',
            interval: 365,
          },
        },
      },
    }),
    studiesCaracteristiquesCombienChartGroupesPatients: ([
      studyType,
      sponsorType,
    ]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        enrollment: {
          range: {
            field: 'enrollment_count',
            ranges: [
              { key: '50-less', to: 50 },
              { key: '50-99', from: 50, to: 100 },
              { key: '100-499', from: 100, to: 500 },
              { key: '500-999', from: 500, to: 1000 },
              { key: '1000-4999', from: 1000, to: 5000 },
              { key: '5000-more', from: 5000 },
            ],
          },
        },
      },
    }),
    studiesCaracteristiquesCombienChartProportionModesRepartition: ([
      studyType,
      sponsorType,
    ]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
            size: 30,
          },
          aggs: {
            by_design_allocation: {
              terms: {
                field: 'design_allocation.keyword',
                missing: 'N/A',
              },
            },
          },
        },
      },
    }),
    studiesCaracteristiquesTypes: ([studyType, sponsorType]) => ({
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
              wildcard: {
                'lead_sponsor_type.keyword': sponsorType,
              },
            },
          ],
        },
      },
      aggs: {
        by_year: {
          terms: {
            field: 'study_start_year',
            size: 30,
          },
          aggs: {
            by_intervention_type: {
              terms: {
                field: 'intervention_type.keyword',
                missing: 'N/A',
              },
            },
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
  const { bsoCountry, bsoLocalAffiliation, endYear, startYear } = getURLSearchParams();
  // On graphs about interventional trials and observational studies, no filter on country is needed because it is only about France
  const noCountryNeeded = parameters.includes('Interventional')
    || parameters.includes('Observational');
  if (bsoCountry && !noCountryNeeded) {
    queryResponse.query.bool.filter.push({
      term: { bso_country: bsoCountry },
    });
  }
  if (bsoLocalAffiliation) {
    queryResponse.query.bool.filter.push({
      term: { bso_local_affiliations: bsoLocalAffiliation },
    });
    const year = {};
    if (startYear) {
      year.gte = parseInt(startYear, 10);
    }
    if (endYear) {
      year.lte = parseInt(endYear, 10);
    }
    if (year) {
      queryResponse.query.bool.filter.push({
        range: { year },
      });
    }
  }
  return queryResponse;
}

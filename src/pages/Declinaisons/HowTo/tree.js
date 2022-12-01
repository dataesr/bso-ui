const tree = [
  {
    label: 'Publications',
    value: 'publi',
    children: [
      {
        label: 'Général',
        value: 'general',
        children: [
          {
            label: "Taux d'accès ouvert",
            value: 'publi.general.dynamique-ouverture.chart-taux-ouverture',
          },
          {
            label: "Évolution du taux d'accès ouvert",
            value:
              'publi.general.dynamique-ouverture.chart-evolution-proportion',
          },
          {
            label: "Répartition par voie d'ouverture",
            value:
              'publi.general.voies-ouverture.chart-repartition-publications',
          },
          {
            label: "Répartition par voie d'ouverture par année de publication",
            value: 'publi.general.voies-ouverture.chart-repartition-taux',
          },
          {
            label: "Taux d'accès ouvert par type de publications",
            value: 'publi.general.genres-ouverture.chart-repartition-genres',
          },
          {
            label: "Taux d'accès ouvert par langue de publications",
            value:
              'publi.general.langues-ouverture.chart-repartition-publications',
          },
        ],
      },
      {
        label: 'Disciplines',
        value: 'disciplines',
      },
      {
        label: 'Editeurs',
        value: 'publishers',
      },
      {
        label: 'Archives ouvertes',
        value: 'repositories',
      },
      {
        label: 'Financements',
        value: 'others',
      },
    ],
  },
  {
    label: 'Thèses de doctorat',
    value: 'theses',
    children: [
      {
        label: 'Général',
        value: 'general',
      },
    ],
  },
  {
    label: 'Données de la recherche',
    value: 'data',
    children: [
      {
        label: 'Général',
        value: 'general',
      },
      {
        label: 'Disciplines',
        value: 'disciplines',
      },
    ],
  },
  {
    label: 'Codes et logiciels',
    value: 'codes',
    children: [
      {
        label: 'Général',
        value: 'general',
      },
      {
        label: 'Disciplines',
        value: 'disciplines',
      },
    ],
  },
];

export default tree;

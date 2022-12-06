const tree = [
  {
    label: 'Les publications',
    value: 'publi',
    children: [
      {
        label: 'Général',
        value: 'general',
        children: [
          {
            label:
              "Taux d'accès ouvert des publications scientifiques françaises parues durant l'année précédente par date d'observation",
            value: 'publi.general.dynamique-ouverture.chart-taux-ouverture',
          },
          {
            label:
              "Évolution du taux d'accès ouvert des publications scientifiques françaises par année d'observation",
            value:
              'publi.general.dynamique-ouverture.chart-evolution-proportion',
          },
          {
            label:
              "Répartition des publications scientifiques françaises parues en 2021 par voie d'ouverture",
            value:
              'publi.general.voies-ouverture.chart-repartition-publications',
          },
          {
            label:
              "Répartition des publications scientifiques françaises en accès ouvert par voie d'ouverture et par année de publication",
            value: 'publi.general.voies-ouverture.chart-repartition-taux',
          },
          {
            label: "Taux d'accès ouvert par type de publications françaises",
            value: 'publi.general.genres-ouverture.chart-repartition-genres',
          },
          {
            label: "Taux d'accès ouvert par langue de publications françaises",
            value:
              'publi.general.langues-ouverture.chart-repartition-publications',
          },
        ],
      },
      {
        label: 'Disciplines',
        value: 'disciplines',
        children: [
          {
            label:
              "Taux d'accès ouvert par discipline et par date d'observation, pour les publications françaises parues durant l'année précédente (disciplines présentées dans l'ordre du taux d'accès décroissant)",
            value: 'publi.disciplines.dynamique-ouverture.chart-taux-ouverture',
          },
          {
            label:
              "Dynamique d'évolution du taux de publications françaises en accès ouvert pour chaque discipline par année d'observation",
            value:
              'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture',
          },
          {
            label:
              "Répartition des publications françaises par voie d'ouverture pour chaque discipline",
            value:
              'publi.disciplines.voies-ouverture.chart-repartition-publications',
          },
          {
            label:
              "Positionnement des disciplines en fonction des voies privilégiées pour l'ouverture de leurs publications françaises",
            value:
              'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement',
          },
        ],
      },
      {
        label: 'Editeurs',
        value: 'publishers',
        children: [
          {
            label:
              "Part des publications scientifiques françaises mises à disposition en accès ouvert par leur éditeur, par année d'observation, pour les publications parues durant l'année précédente",
            value: 'publi.publishers.dynamique-ouverture.chart-taux-ouverture',
          },
          {
            label:
              "Évolution de la part des publications françaises mises à disposition en accès ouvert par l'éditeur par année d'observation",
            value:
              'publi.publishers.dynamique-ouverture.chart-evolution-proportion',
          },
          {
            label:
              'Répartition des modèles économiques pour les articles parus en 2021 et diffusés en accès ouvert par leur éditeur',
            value: 'publi.publishers.type-ouverture.chart-repartition-modeles',
          },
          {
            label:
              'Évolution des modèles économiques pour les articles diffusés en accès ouvert par leur éditeur, par année de publication',
            value:
              'publi.publishers.type-ouverture.chart-evolution-repartition',
          },
          {
            label:
              "Modalités d'ouverture des publications scientifiques françaises chez les éditeurs ou plateformes de publication les plus importants en volume (top 25)",
            value: 'publi.publishers.politiques-ouverture.chart-classement',
          },
          {
            label:
              "Positionnement des éditeurs et plateformes de publication en fonction des voies privilégiées pour l'ouverture des publications françaises qu'ils diffusent",
            value: 'publi.publishers.politiques-ouverture.chart-comparaison',
          },
          {
            label:
              'Répartition des publications scientifiques françaises ouvertes par type de licence utilisée',
            value: 'publi.publishers.repartition-licences.chart-repartition',
          },
          {
            label:
              "Taux d'utilisation d'une licence libre par les éditeurs ou plateformes de publication qui diffusent le plus de publications scientifiques françaises en accès ouvert (top 25)",
            value: 'publi.publishers.repartition-licences.chart-classement',
          },
          {
            label:
              'Distribution des publications scientifiques françaises en fonction des frais de publication pratiqués',
            value: 'publi.publishers.couts-publication.chart-distribution',
          },
        ],
      },
      {
        label: 'Archives ouvertes',
        value: 'repositories',
        children: [
          {
            label:
              "Taux de publications scientifiques françaises ouvertes et hébergées sur une archive ouverte par date d'observation",
            value:
              'publi.repositories.dynamique-ouverture.chart-taux-ouverture',
          },
          {
            label:
              "Évolution du taux de publications scientifiques françaises hébergées sur une archive ouverte, par date d'observation",
            value:
              'publi.repositories.dynamique-ouverture.chart-evolution-proportion',
          },
          {
            label:
              'Principales archives ouvertes hébergeant des publications scientifiques françaises',
            value: 'publi.repositories.plus-utilisees.chart-nombre-documents',
          },
          {
            label:
              'Taux de couverture de HAL sur les publications scientifiques françaises hébergées sur une archive ouverte',
            value: 'publi.repositories.dynamique-hal.chart-couverture-hal',
          },
        ],
      },
    ],
  },
  {
    label: 'Les thèses de doctorat',
    value: 'theses',
    children: [
      {
        label: 'Général',
        value: 'general',
        children: [
          {
            label:
              "Taux d'ouverture des thèses de doctorat françaises par année de soutenance",
            value: 'thesis.general.voies-ouverture.chart-repartition-taux',
          },
          {
            label:
              "Répartition des thèses de doctorat françaises par voie d'ouverture pour chaque discipline",
            value:
              'thesis.disciplines.voies-ouverture.chart-repartition-thesis',
          },
        ],
      },
    ],
  },
  {
    label: 'Les données de la recherche',
    value: 'data',
    children: [
      {
        label: 'Général',
        value: 'general',
        children: [
          {
            label: 'Proportion de publications qui partagent un jeu de données',
            value: 'data.general.voies-ouverture.chart-data-shared',
          },
          {
            label: 'Proportion de publications qui utilisent un jeu de données',
            value: 'data.general.voies-ouverture.chart-data-used',
          },
          {
            label:
              'Proportion de publications qui présentent un Data Availibility Statement',
            value: 'data.general.voies-ouverture.chart-availibility',
          },
        ],
      },
      {
        label: 'Disciplines',
        value: 'disciplines',
        children: [
          {
            label:
              'Proportion de publications qui partagent un jeu de données par discipline',
            value: 'data.disciplines.voies-ouverture.chart-data-shared',
          },
          {
            label:
              'Proportion de publications qui réutilisent un jeu de données par discipline',
            value: 'data.disciplines.voies-ouverture.chart-data-used',
          },
          {
            label:
              'Proportion des publications qui présentent un Data Availibility Statement par discipline',
            value: 'data.disciplines.voies-ouverture.chart-availibility',
          },
        ],
      },
    ],
  },
  {
    label: 'Les codes et logiciels',
    value: 'codes',
    children: [
      {
        label: 'Général',
        value: 'general',
        children: [
          {
            label:
              'Proportion de publications qui partagent un logiciel ou du code',
            value: 'software.general.voies-ouverture.chart-software-shared',
          },
          {
            label:
              'Proportion de publications qui utilisent un logiciel ou du code',
            value: 'software.general.voies-ouverture.chart-software-used',
          },
        ],
      },
      {
        label: 'Disciplines',
        value: 'disciplines',
        children: [
          {
            label:
              'Proportion de publications qui partagent un logiciel ou du code par discipline',
            value: 'software.disciplines.voies-ouverture.chart-software-shared',
          },
          {
            label:
              'Proportion de publications qui réutilisent un logiciel ou du code par discipline',
            value: 'software.disciplines.voies-ouverture.chart-software-used',
          },
        ],
      },
    ],
  },
];

export default tree;

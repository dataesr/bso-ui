import { lazy } from 'react';

// Essais cliniques + études observationnelles
const ChartGroupesPatientsStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/combien/chart-groupes-patients'
));
const ChartProportionModesRepartitionStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/combien/chart-proportion-modes-repartition'
));
const ChartNombreStudies = lazy(() => import('../components/Charts/studies/caracteristiques/duree/chart-nombre'));
const ChartDistributionDeclarationsStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/quand/chart-distribution-declarations'
));
const ChartEvolutionTemporalitesStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/quand/chart-evolution-temporalites'
));
const ChartRepartitionAvantApresStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/quand/chart-repartition-avant-apres'
));
const ChartEvolutionNombreStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/types/chart-evolution-nombre'
));
const ChartEvolutionStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution'
));
const ChartEvolutionWithin3YearsStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years'
));
const ChartEvolutionWithin3YearsByYearStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years-by-year'
));
const ChartEvolutionWithin1YearStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-1-year'
));
const ChartEvolutionWithin1YearByYearStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-1-year-by-year'
));
const ChartRepartitionStudies = lazy(() => import('../components/Charts/studies/general/trajectoires/chart-repartition'));
const ChartDynamiqueNombreStudies = lazy(() => import(
  '../components/Charts/studies/promoteurs/dynamique-ouverture/chart-evolution-nombre'
));
const ChartPartStudies = lazy(() => import(
  '../components/Charts/studies/promoteurs/dynamique-ouverture/chart-part'
));
const ChartClassementPaysStudies = lazy(() => import(
  '../components/Charts/studies/promoteurs/impact/chart-classement-pays'
));
const ChartPromoteursRepartitionStudies = lazy(() => import('../components/Charts/studies/promoteurs/impact/chart-repartition'));
const ChartDistributionStudies = lazy(() => import(
  '../components/Charts/studies/resultats/delai-diffusion/chart-distribution'
));
const ChartDelaiDiffusionRepartitionStudies = lazy(() => import(
  '../components/Charts/studies/resultats/delai-diffusion/chart-repartition'
));
const ChartPlanPartageRepartitionStudies = lazy(() => import(
  '../components/Charts/studies/resultats/plan-partage/chart-repartition'
));
const ChartResultatsRepartitionStudies = lazy(() => import(
  '../components/Charts/studies/resultats/publication/chart-repartition'
));
const ChartResultatsRepartitionIcmjeStudies = lazy(() => import(
  '../components/Charts/studies/resultats/publication/chart-repartition-icmje'
));
const ChartTypeDiffusionRepartitionStudies = lazy(() => import(
  '../components/Charts/studies/resultats/type-diffusion/chart-repartition'
));
const ChartRepartitionParTypeStudies = lazy(() => import(
  '../components/Charts/studies/resultats/type-diffusion/chart-repartition-par-type'
));

// Theses
const ChartRepartitionTauxThesis = lazy(() => import(
  '../components/Charts/thesis/general/voies-ouverture/chart-repartition-taux'
));
const ChartTauxOuvertureThesis = lazy(() => import(
  '../components/Charts/thesis/disciplines/dynamique-ouverture/chart-taux-ouverture'
));
const ChartRepartitionThesis = lazy(() => import(
  '../components/Charts/thesis/disciplines/voies-ouverture/chart-repartition-thesis'
));

// Data & code
const ChartDataUsed = lazy(() => import('../components/Charts/data/general/voies-ouverture/chart-data-used'));
const ChartDataCreated = lazy(() => import(
  '../components/Charts/data/general/voies-ouverture/chart-data-created'
));
const ChartDataShared = lazy(() => import('../components/Charts/data/general/voies-ouverture/chart-data-shared'));
const ChartDataSharedAmongAll = lazy(() => import(
  '../components/Charts/data/general/voies-ouverture/chart-data-shared-among-all'
));
const ChartDataAvailibility = lazy(() => import(
  '../components/Charts/data/general/voies-ouverture/chart-availibility'
));
const ChartDataUsedDiscipline = lazy(() => import(
  '../components/Charts/data/disciplines/voies-ouverture/chart-data-used'
));
const ChartDataCreatedDiscipline = lazy(() => import(
  '../components/Charts/data/disciplines/voies-ouverture/chart-data-created'
));
const ChartDataSharedDiscipline = lazy(() => import(
  '../components/Charts/data/disciplines/voies-ouverture/chart-data-shared'
));
const ChartDataSharedAmongAllDiscipline = lazy(() => import(
  '../components/Charts/data/disciplines/voies-ouverture/chart-data-shared-among-all'
));
const ChartDataAvailibilityDiscipline = lazy(() => import(
  '../components/Charts/data/disciplines/voies-ouverture/chart-availibility'
));
const ChartDataAvailibilityEditeur = lazy(() => import(
  '../components/Charts/data/editeurs/voies-ouverture/chart-availibility'
));
const ChartSoftwareUsed = lazy(() => import(
  '../components/Charts/software/general/voies-ouverture/chart-software-used'
));
const ChartSoftwareCreated = lazy(() => import(
  '../components/Charts/software/general/voies-ouverture/chart-software-created'
));
const ChartSoftwareShared = lazy(() => import(
  '../components/Charts/software/general/voies-ouverture/chart-software-shared'
));
const ChartSoftwareSharedAmongAll = lazy(() => import(
  '../components/Charts/software/general/voies-ouverture/chart-software-shared-among-all'
));
const ChartSoftwareUsedDiscipline = lazy(() => import(
  '../components/Charts/software/disciplines/voies-ouverture/chart-software-used'
));
const ChartSoftwareCreatedDiscipline = lazy(() => import(
  '../components/Charts/software/disciplines/voies-ouverture/chart-software-created'
));
const ChartSoftwareSharedDiscipline = lazy(() => import(
  '../components/Charts/software/disciplines/voies-ouverture/chart-software-shared'
));
const ChartSoftwareSharedAmongAllDiscipline = lazy(() => import(
  '../components/Charts/software/disciplines/voies-ouverture/chart-software-shared-among-all'
));
const ChartSoftwareSharedOa = lazy(() => import(
  '../components/Charts/software/oa/voies-ouverture/chart-software-shared'
));

// Orcid
const OrcidEvolution = lazy(() => import('../components/Charts/orcid/general/chart-evolution'));
const OrcidCreationByYear = lazy(() => import('../components/Charts/orcid/general/creation-by-year'));
const ChartOrcidAffiliationSource = lazy(() => import(
  '../components/Charts/orcid/general/chart-indicator-affiliationsource'
));
const ChartOrcidWorkSource = lazy(() => import('../components/Charts/orcid/general/chart-indicator-worksource'));
const ChartOrcidActive = lazy(() => import('../components/Charts/orcid/general/chart-indicator-active'));
const ChartOrcidHal = lazy(() => import('../components/Charts/orcid/general/chart-indicator-hal'));
const ChartOrcidWork = lazy(() => import('../components/Charts/orcid/general/chart-indicator-work'));
const ChartOrcidActiveWork = lazy(() => import('../components/Charts/orcid/general/chart-indicator-active-work'));
const ChartOrcidAffiliationId = lazy(() => import('../components/Charts/orcid/general/chart-indicator-affiliationid'));
const ChartOrcidTheseYear = lazy(() => import('../components/Charts/orcid/general/chart-indicator-these-year'));
const ChartOrcidTheseDiscipline = lazy(() => import('../components/Charts/orcid/general/chart-indicator-these-discipline'));
const ChartOrcidIdrefAbes = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-abes'));
const ChartOrcidIdrefHal = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-hal'));
const ChartOrcidIdrefSame = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-same'));
const ChartOrcidIdhalAbes = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-abes'));
const ChartOrcidIdhalHal = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-hal'));
const ChartOrcidIdhalSame = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-same'));

// Others
const HalNoDoiByField = lazy(() => import(
  '../components/Charts/publications/others/hal-no-doi/hal-no-doi-by-field'
));
const ChartInterationalCollaborations = lazy(() => import(
  '../components/Charts/publications/others/collaborations/international-collaborations'
));
const RetractionsByYear = lazy(() => import('../components/Charts/publications/others/retractions/chart-by-year'));
const RetractionsByField = lazy(() => import('../components/Charts/publications/others/retractions/chart-by-field'));
const RetractionsByPublisher = lazy(() => import(
  '../components/Charts/publications/others/retractions/chart-by-publisher'
));
const RetractionsByNature = lazy(() => import(
  '../components/Charts/publications/others/retractions/chart-by-nature'
));
const RetractionsByReason = lazy(() => import(
  '../components/Charts/publications/others/retractions/chart-by-reason'
));
const PublicationsBySource = lazy(() => import(
  '../components/Charts/publications/others/sources/publications-by-source'
));

const chartComponents = {
  'publi.affiliations.dynamique-ouverture.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/publications/affiliations/dynamique-ouverture/chart-taux-ouverture'
  )),
  'publi.affiliations.pays.chart-classement-pays': lazy(() => import(
    '../components/Charts/publications/affiliations/pays/chart-classement-pays'
  )),
  'publi.affiliations.pays.chart-taux-rang-utile': lazy(() => import(
    '../components/Charts/publications/affiliations/pays/chart-taux-rang-utile'
  )),
  'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture': lazy(
    () => import(
      '../components/Charts/publications/disciplines/dynamique-ouverture/chart-evolution-taux-ouverture'
    ),
  ),
  'publi.disciplines.dynamique-ouverture.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/publications/disciplines/dynamique-ouverture/chart-taux-ouverture'
  )),
  'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement':
    lazy(() => import(
      '../components/Charts/publications/disciplines/voies-ouverture/chart-evolution-comparaison-types-hebergement'
    )),
  'publi.disciplines.voies-ouverture.chart-repartition-publications': lazy(() => import(
    '../components/Charts/publications/disciplines/voies-ouverture/chart-repartition-publications'
  )),
  'publi.general.dynamique-ouverture.chart-evolution-proportion': lazy(() => import(
    '../components/Charts/publications/general/dynamique-ouverture/chart-evolution-proportion'
  )),
  'publi.repositories.dynamique-depot.chart-nombre-documents-depots': lazy(() => import(
    '../components/Charts/publications/archives/dynamique-depot/chart-nombre-documents-depots'
  )),
  'publi.repositories.dynamique-hal.chart-couverture-hal': lazy(() => import(
    '../components/Charts/publications/archives/dynamique-hal/chart-couverture-hal'
  )),
  'publi.repositories.dynamique-ouverture.chart-evolution-proportion': lazy(
    () => import(
      '../components/Charts/publications/archives/dynamique-ouverture/chart-taux-presence'
    ),
  ),
  'publi.repositories.dynamique-ouverture.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/publications/archives/dynamique-ouverture/chart-taux-ouverture'
  )),
  'publi.repositories.plus-utilisees.chart-nombre-documents': lazy(() => import(
    '../components/Charts/publications/archives/plus-utilisees/chart-nombre-documents'
  )),
  'publi.affiliations.dynamique-ouverture.chart-evolution-proportion': lazy(
    () => import(
      '../components/Charts/publications/affiliations/dynamique-ouverture/chart-evolution-proportion'
    ),
  ),
  'publi.affiliations.dynamique-ouverture.chart-evolution-taux': lazy(() => import(
    '../components/Charts/publications/affiliations/dynamique-ouverture/chart-evolution-taux'
  )),
  'publi.general.voies-ouverture.chart-repartition-taux': lazy(() => import(
    '../components/Charts/publications/general/voies-ouverture/chart-repartition-taux'
  )),
  'publi.general.voies-ouverture.chart-repartition-publications': lazy(() => import(
    '../components/Charts/publications/general/voies-ouverture/chart-repartition-publications'
  )),
  'publi.general.langues-ouverture.chart-repartition-publications': lazy(() => import(
    '../components/Charts/publications/general/langues-ouverture/langues-ouverture'
  )),
  'publi.general.langues.chart-publications-by-year': lazy(() => import(
    '../components/Charts/publications/general/langues-evolution/langues-by-year'
  )),
  'publi.general.impact-financement.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/publications/general/impact-financement/chart-taux-ouverture'
  )),
  'publi.general.impact-financement.chart-business-model': lazy(() => import(
    '../components/Charts/publications/general/impact-financement/chart-business-model'
  )),
  'publi.general.impact-financement.chart-taux-ouverture-all-grants': lazy(() => import(
    '../components/Charts/publications/general/impact-financement/chart-taux-ouverture-all-grants'
  )),
  'publi.general.impact-financement.chart-repartition-financements': lazy(() => import(
    '../components/Charts/publications/general/impact-financement/chart-repartition-financements'
  )),
  'publi.general.impact-financement.chart-repartition-taux': lazy(() => import(
    '../components/Charts/publications/general/impact-financement/chart-repartition-taux'
  )),
  'publi.general.genres-ouverture.chart-repartition-genres': lazy(() => import(
    '../components/Charts/publications/general/genres-ouverture/genres-ouverture'
  )),
  'publi.general.genres-ouverture.chart-evolution-proportion': lazy(() => import(
    '../components/Charts/publications/general/genres-ouverture/chart-evolution-proportion'
  )),
  'publi.general.dynamique-ouverture.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/publications/general/dynamique-ouverture/chart-taux-ouverture'
  )),
  'publi.general.dynamique-ouverture.chart-taux-ouverture-article': lazy(() => import(
    '../components/Charts/publications/general/dynamique-ouverture/chart-taux-ouverture-article'
  )),
  'publi.publishers.type-ouverture.chart-repartition-modeles': lazy(() => import(
    '../components/Charts/publications/editeurs/type-ouverture/chart-repartition-modeles'
  )),
  'publi.publishers.type-ouverture.chart-evolution-repartition': lazy(() => import(
    '../components/Charts/publications/editeurs/type-ouverture/chart-evolution-repartition'
  )),
  'publi.publishers.repartition-licences.chart-repartition': lazy(() => import(
    '../components/Charts/publications/editeurs/repartition-licences/chart-repartition'
  )),
  'publi.publishers.repartition-licences.chart-classement': lazy(() => import(
    '../components/Charts/publications/editeurs/repartition-licences/chart-classement'
  )),
  'publi.publishers.politiques-ouverture.chart-comparaison': lazy(() => import(
    '../components/Charts/publications/editeurs/politiques-ouverture/chart-comparaison'
  )),
  'publi.publishers.politiques-ouverture.chart-classement': lazy(() => import(
    '../components/Charts/publications/editeurs/politiques-ouverture/chart-classement'
  )),
  'publi.publishers.poids-revues.chart-repartition': lazy(() => import(
    '../components/Charts/publications/editeurs/poids-revues/chart-repartition'
  )),
  'publi.publishers.dynamique-ouverture.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/publications/editeurs/dynamique-ouverture/chart-taux-ouverture'
  )),
  'publi.publishers.dynamique-ouverture.chart-evolution-proportion': lazy(() => import(
    '../components/Charts/publications/editeurs/dynamique-ouverture/chart-evolution-proportion'
  )),
  'publi.publishers.dynamique-ouverture-journals.chart-taux-ouverture': lazy(
    () => import(
      '../components/Charts/publications/editeurs/dynamique-ouverture-journals/chart-taux-ouverture'
    ),
  ),
  'publi.publishers.couts-publication.chart-distribution-par-annee': lazy(() => import(
    '../components/Charts/publications/editeurs/couts-publication/chart-distribution-par-annee'
  )),
  'publi.publishers.couts-publication.chart-distribution': lazy(() => import(
    '../components/Charts/publications/editeurs/couts-publication/chart-distribution'
  )),
  'publi.publishers.couts-publication.chart-depenses-estimees': lazy(() => import(
    '../components/Charts/publications/editeurs/couts-publication/chart-depenses-estimees'
  )),
  'publi.others.collaborations.international-collaborations':
    ChartInterationalCollaborations,
  'general.dynamique.chart-evolution': ChartEvolutionStudies,
  'general.dynamique.chart-evolution-within-3-years':
    ChartEvolutionWithin3YearsStudies,
  'general.dynamique.chart-evolution-within-3-years-by-year':
    ChartEvolutionWithin3YearsByYearStudies,
  'general.dynamique.chart-evolution-within-1-year':
    ChartEvolutionWithin1YearStudies,
  'general.dynamique.chart-evolution-within-1-year-by-year':
    ChartEvolutionWithin1YearByYearStudies,
  'general.trajectoires.chart-repartition': ChartRepartitionStudies,
  'caracteristiques.quand.chart-evolution-temporalites':
    ChartEvolutionTemporalitesStudies,
  'caracteristiques.quand.chart-repartition-avant-apres':
    ChartRepartitionAvantApresStudies,
  'caracteristiques.quand.chart-distribution-declarations':
    ChartDistributionDeclarationsStudies,
  'caracteristiques.duree.chart-nombre': ChartNombreStudies,
  'caracteristiques.combien.chart-groupes-patients':
    ChartGroupesPatientsStudies,
  'caracteristiques.combien.chart-proportion-modes-repartition':
    ChartProportionModesRepartitionStudies,
  'caracteristiques.types.chart-evolution-nombre': ChartEvolutionNombreStudies,
  'promoteurs.dynamique-ouverture.chart-part': ChartPartStudies,
  'promoteurs.dynamique-ouverture.chart-evolution-nombre':
    ChartDynamiqueNombreStudies,
  'promoteurs.impact.chart-repartition': ChartPromoteursRepartitionStudies,
  'promoteurs.impact.chart-classement-pays': ChartClassementPaysStudies,
  'resultats.type-diffusion.chart-repartition':
    ChartTypeDiffusionRepartitionStudies,
  'resultats.type-diffusion.chart-repartition-par-type':
    ChartRepartitionParTypeStudies,
  'resultats.plan-partage.chart-repartition':
    ChartPlanPartageRepartitionStudies,
  'resultats.delai-diffusion.chart-repartition':
    ChartDelaiDiffusionRepartitionStudies,
  'resultats.delai-diffusion.chart-distribution': ChartDistributionStudies,
  'resultats.publication.chart-repartition': ChartResultatsRepartitionStudies,
  'resultats.publication.chart-repartition-icmje':
    ChartResultatsRepartitionIcmjeStudies,
  'thesis.general.voies-ouverture.chart-repartition-taux':
    ChartRepartitionTauxThesis,
  'thesis.disciplines.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureThesis,
  'thesis.disciplines.voies-ouverture.chart-repartition-thesis':
    ChartRepartitionThesis,
  // Code
  'software.general.voies-ouverture.chart-software-used': ChartSoftwareUsed,
  'software.general.voies-ouverture.chart-software-created':
    ChartSoftwareCreated,
  'software.general.voies-ouverture.chart-software-shared': ChartSoftwareShared,
  'software.general.voies-ouverture.chart-software-shared-among-all':
    ChartSoftwareSharedAmongAll,
  'software.disciplines.voies-ouverture.chart-software-used':
    ChartSoftwareUsedDiscipline,
  'software.disciplines.voies-ouverture.chart-software-created':
    ChartSoftwareCreatedDiscipline,
  'software.disciplines.voies-ouverture.chart-software-shared':
    ChartSoftwareSharedDiscipline,
  'software.disciplines.voies-ouverture.chart-software-shared-among-all':
    ChartSoftwareSharedAmongAllDiscipline,
  'software.oa.voies-ouverture.chart-software-shared': ChartSoftwareSharedOa,
  'software.general.mentions.software-with-at-least-one-explicit-mention': lazy(
    () => import(
      '../components/Charts/software/general/mentions/software-with-at-least-one-explicit-mention'
    ),
  ),
  // Data
  'data.general.voies-ouverture.chart-data-used': ChartDataUsed,
  'data.general.voies-ouverture.chart-data-created': ChartDataCreated,
  'data.general.voies-ouverture.chart-data-shared': ChartDataShared,
  'data.general.voies-ouverture.chart-data-shared-among-all':
    ChartDataSharedAmongAll,
  'data.general.voies-ouverture.chart-availibility': ChartDataAvailibility,
  'data.disciplines.voies-ouverture.chart-data-used': ChartDataUsedDiscipline,
  'data.disciplines.voies-ouverture.chart-data-created':
    ChartDataCreatedDiscipline,
  'data.disciplines.voies-ouverture.chart-data-shared':
    ChartDataSharedDiscipline,
  'data.disciplines.voies-ouverture.chart-data-shared-among-all':
    ChartDataSharedAmongAllDiscipline,
  'data.disciplines.voies-ouverture.chart-availibility':
    ChartDataAvailibilityDiscipline,
  'data.editeurs.voies-ouverture.chart-availibility':
    ChartDataAvailibilityEditeur,
  'data.general.mentions.datasets-with-at-least-one-explicit-mention': lazy(
    () => import(
      '../components/Charts/data/general/mentions/datasets-with-at-least-one-explicit-mention'
    ),
  ),
  // Orcid
  'orcid.general.chart-evolution': OrcidEvolution,
  'orcid.general.creation-by-year': OrcidCreationByYear,
  'orcid.general.chart-indicator-worksource': ChartOrcidWorkSource,
  'orcid.general.chart-indicator-affiliationsource':
    ChartOrcidAffiliationSource,
  'orcid.general.chart-indicator-active': ChartOrcidActive,
  'orcid.general.chart-indicator-hal': ChartOrcidHal,
  'orcid.general.chart-indicator-work': ChartOrcidWork,
  'orcid.general.chart-indicator-active-work': ChartOrcidActiveWork,
  'orcid.general.chart-indicator-affiliationid': ChartOrcidAffiliationId,
  'orcid.general.chart-indicator-these-year': ChartOrcidTheseYear,
  'orcid.general.chart-indicator-these-discipline': ChartOrcidTheseDiscipline,
  'orcid.general.chart-indicator-idref-abes': ChartOrcidIdrefAbes,
  'orcid.general.chart-indicator-idref-hal': ChartOrcidIdrefHal,
  'orcid.general.chart-indicator-idref-same': ChartOrcidIdrefSame,
  'orcid.general.chart-indicator-idhal-abes': ChartOrcidIdhalAbes,
  'orcid.general.chart-indicator-idhal-hal': ChartOrcidIdhalHal,
  'orcid.general.chart-indicator-idhal-same': ChartOrcidIdhalSame,
  // Others
  'publi.others.hal-no-doi.hal-no-doi-by-field': HalNoDoiByField,
  'publi.others.hal-no-doi.hal-no-doi-by-field-by-year': lazy(() => import(
    '../components/Charts/publications/others/hal-no-doi/hal-no-doi-by-field-by-year'
  )),
  'publi.others.retractions.chart-by-year': RetractionsByYear,
  'publi.others.retractions.chart-by-field': RetractionsByField,
  'publi.others.retractions.chart-by-publisher': RetractionsByPublisher,
  'publi.others.retractions.chart-by-nature': RetractionsByNature,
  'publi.others.retractions.chart-by-reason': RetractionsByReason,
  'publi.others.sources.publications-by-source': PublicationsBySource,
};

export default chartComponents;

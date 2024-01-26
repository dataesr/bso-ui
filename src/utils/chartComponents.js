import { lazy } from 'react';

const ChartClassementPays = lazy(() => import(
  '../components/Charts/publications/affiliations/pays/chart-classement-pays'
));
const ChartEvolutionTauxOuvertureRangUtile = lazy(() => import(
  '../components/Charts/publications/affiliations/pays/chart-taux-rang-utile'
));
const ChartNombreDocumentsDepotsRepositories = lazy(() => import(
  '../components/Charts/publications/archives/dynamique-depot/chart-nombre-documents-depots'
));
const ChartTauxCouvertureHAL = lazy(() => import(
  '../components/Charts/publications/archives/dynamique-hal/chart-couverture-hal'
));
const ChartTauxOuvertureArchives = lazy(() => import(
  '../components/Charts/publications/archives/dynamique-ouverture/chart-taux-ouverture'
));
const ChartTauxPresenceRepositories = lazy(() => import(
  '../components/Charts/publications/archives/dynamique-ouverture/chart-taux-presence'
));
const ChartNombreDocumentsRepositories = lazy(() => import(
  '../components/Charts/publications/archives/plus-utilisees/chart-nombre-documents'
));
const ChartEvolutionTauxOuvertureDisciplines = lazy(() => import(
  '../components/Charts/publications/disciplines/dynamique-ouverture/chart-evolution-taux-ouverture'
));
const ChartTauxOuvertureDisciplines = lazy(() => import(
  '../components/Charts/publications/disciplines/dynamique-ouverture/chart-taux-ouverture'
));
const ChartEvolutionComparaisonTypesHebergementDisciplines = lazy(() => import(
  '../components/Charts/publications/disciplines/voies-ouverture/chart-evolution-comparaison-types-hebergement'
));
const ChartRepartitionPublicationsDisciplines = lazy(() => import(
  '../components/Charts/publications/disciplines/voies-ouverture/chart-repartition-publications'
));
const ChartDepensesEstimeesPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/couts-publication/chart-depenses-estimees'
));
const ChartDistributionPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/couts-publication/chart-distribution'
));
const ChartDistributionParAnnee = lazy(() => import(
  '../components/Charts/publications/editeurs/couts-publication/chart-distribution-par-annee'
));
const ChartEvolutionProportionPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/dynamique-ouverture/chart-evolution-proportion'
));
const ChartTauxOuverturePublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/dynamique-ouverture/chart-taux-ouverture'
));
const ChartRepartitionPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/poids-revues/chart-repartition'
));
const ChartTauxOuvertureJournals = lazy(() => import(
  '../components/Charts/publications/editeurs/dynamique-ouverture-journals/chart-taux-ouverture'
));
const ChartClassementPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/politiques-ouverture/chart-classement'
));
const ChartComparaisonPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/politiques-ouverture/chart-comparaison'
));
const ChartClassementLicencesPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/repartition-licences/chart-classement'
));
const ChartRepartitionLicencesPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/repartition-licences/chart-repartition'
));
const ChartEvolutionRepartitionPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/type-ouverture/chart-evolution-repartition'
));
const ChartRepartitionModelesPublishers = lazy(() => import(
  '../components/Charts/publications/editeurs/type-ouverture/chart-repartition-modeles'
));
const ChartEvolutionProportion = lazy(() => import(
  '../components/Charts/publications/general/dynamique-ouverture/chart-evolution-proportion'
));
const ChartTauxOuverture = lazy(() => import(
  '../components/Charts/publications/general/dynamique-ouverture/chart-taux-ouverture'
));
const ChartTauxOuvertureArticle = lazy(() => import(
  '../components/Charts/publications/general/dynamique-ouverture/chart-taux-ouverture-article'
));
const ChartGenreOuverture = lazy(() => import(
  '../components/Charts/publications/general/genres-ouverture/genres-ouverture'
));
const ChartGenreOuvertureEvolution = lazy(() => import(
  '../components/Charts/publications/general/genres-ouverture/chart-evolution-proportion'
));
const ChartRepartitionFinancements = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-repartition-financements'
));
const ChartTauxOuvertureFinancement = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-taux-ouverture'
));
const ChartTauxOuvertureFinancementBusinessModel = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-business-model'
));
const ChartTauxOuvertureFinancementAllGrants = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-taux-ouverture-all-grants'
));
const ChartRepartitionTauxFinancement = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-repartition-taux'
));
const ChartLanguesOuverture = lazy(() => import(
  '../components/Charts/publications/general/langues-ouverture/langues-ouverture'
));
const ChartRepartitionPublications = lazy(() => import(
  '../components/Charts/publications/general/voies-ouverture/chart-repartition-publications'
));
const ChartRepartitionTaux = lazy(() => import(
  '../components/Charts/publications/general/voies-ouverture/chart-repartition-taux'
));
const ChartTauxOuvertureAffiliations = lazy(() => import(
  '../components/Charts/publications/affiliations/dynamique-ouverture/chart-taux-ouverture'
));
const ChartEvolutionProportionAffiliations = lazy(() => import(
  '../components/Charts/publications/affiliations/dynamique-ouverture/chart-evolution-proportion'
));
const ChartEvolutionTauxAffiliations = lazy(() => import(
  '../components/Charts/publications/affiliations/dynamique-ouverture/chart-evolution-taux'
));

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
const ChartEvolutionWithin2YearsStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-2-years'
));
const ChartEvolutionWithin3YearsStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years'
));
const ChartEvolutionWithin2YearsByYearStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-2-years-by-year'
));
const ChartEvolutionWithin3YearsByYearStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years-by-year'
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
// BSO3
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
const ChartOrcidAffiliationId = lazy(() => import('../components/Charts/orcid/general/chart-indicator-affiliationid'));
const ChartOrcidTheseYear = lazy(() => import('../components/Charts/orcid/general/chart-indicator-these-year'));
const ChartOrcidTheseDiscipline = lazy(() => import('../components/Charts/orcid/general/chart-indicator-these-discipline'));
const ChartOrcidIdrefAbes = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-abes'));
const ChartOrcidIdrefHal = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-hal'));
const ChartOrcidIdrefSame = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-same'));
const ChartOrcidIdhalAbes = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-abes'));
const ChartOrcidIdhalHal = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-hal'));
const ChartOrcidIdhalSame = lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-same'));
// Other
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

const chartComponents = {
  'publi.affiliations.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureAffiliations,
  'publi.affiliations.pays.chart-classement-pays': ChartClassementPays,
  'publi.affiliations.pays.chart-taux-rang-utile':
    ChartEvolutionTauxOuvertureRangUtile,
  'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture':
    ChartEvolutionTauxOuvertureDisciplines,
  'publi.disciplines.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureDisciplines,
  'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement':
    ChartEvolutionComparaisonTypesHebergementDisciplines,
  'publi.disciplines.voies-ouverture.chart-repartition-publications':
    ChartRepartitionPublicationsDisciplines,
  'publi.general.dynamique-ouverture.chart-evolution-proportion':
    ChartEvolutionProportion,
  'publi.repositories.dynamique-depot.chart-nombre-documents-depots':
    ChartNombreDocumentsDepotsRepositories,
  'publi.repositories.dynamique-hal.chart-couverture-hal':
    ChartTauxCouvertureHAL,
  'publi.repositories.dynamique-ouverture.chart-evolution-proportion':
    ChartTauxPresenceRepositories,
  'publi.repositories.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureArchives,
  'publi.repositories.plus-utilisees.chart-nombre-documents':
    ChartNombreDocumentsRepositories,
  'publi.affiliations.dynamique-ouverture.chart-evolution-proportion':
    ChartEvolutionProportionAffiliations,
  'publi.affiliations.dynamique-ouverture.chart-evolution-taux':
    ChartEvolutionTauxAffiliations,
  'publi.general.voies-ouverture.chart-repartition-taux': ChartRepartitionTaux,
  'publi.general.voies-ouverture.chart-repartition-publications':
    ChartRepartitionPublications,
  'publi.general.langues-ouverture.chart-repartition-publications':
    ChartLanguesOuverture,
  'publi.general.impact-financement.chart-taux-ouverture':
    ChartTauxOuvertureFinancement,
  'publi.general.impact-financement.chart-business-model':
    ChartTauxOuvertureFinancementBusinessModel,
  'publi.general.impact-financement.chart-taux-ouverture-all-grants':
    ChartTauxOuvertureFinancementAllGrants,
  'publi.general.impact-financement.chart-repartition-financements':
    ChartRepartitionFinancements,
  'publi.general.impact-financement.chart-repartition-taux':
    ChartRepartitionTauxFinancement,
  'publi.general.genres-ouverture.chart-repartition-genres':
    ChartGenreOuverture,
  'publi.general.genres-ouverture.chart-evolution-proportion':
    ChartGenreOuvertureEvolution,
  'publi.general.dynamique-ouverture.chart-taux-ouverture': ChartTauxOuverture,
  'publi.general.dynamique-ouverture.chart-taux-ouverture-article':
    ChartTauxOuvertureArticle,
  'publi.publishers.type-ouverture.chart-repartition-modeles':
    ChartRepartitionModelesPublishers,
  'publi.publishers.type-ouverture.chart-evolution-repartition':
    ChartEvolutionRepartitionPublishers,
  'publi.publishers.repartition-licences.chart-repartition':
    ChartRepartitionLicencesPublishers,
  'publi.publishers.repartition-licences.chart-classement':
    ChartClassementLicencesPublishers,
  'publi.publishers.politiques-ouverture.chart-comparaison':
    ChartComparaisonPublishers,
  'publi.publishers.politiques-ouverture.chart-classement':
    ChartClassementPublishers,
  'publi.publishers.poids-revues.chart-repartition': ChartRepartitionPublishers,
  'publi.publishers.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuverturePublishers,
  'publi.publishers.dynamique-ouverture.chart-evolution-proportion':
    ChartEvolutionProportionPublishers,
  'publi.publishers.dynamique-ouverture-journals.chart-taux-ouverture':
    ChartTauxOuvertureJournals,
  'publi.publishers.couts-publication.chart-distribution-par-annee':
    ChartDistributionParAnnee,
  'publi.publishers.couts-publication.chart-distribution':
    ChartDistributionPublishers,
  'publi.publishers.couts-publication.chart-depenses-estimees':
    ChartDepensesEstimeesPublishers,
  'publi.others.collaborations.international-collaborations':
    ChartInterationalCollaborations,
  'general.dynamique.chart-evolution': ChartEvolutionStudies,
  'general.dynamique.chart-evolution-within-2-years':
    ChartEvolutionWithin2YearsStudies,
  'general.dynamique.chart-evolution-within-3-years':
    ChartEvolutionWithin3YearsStudies,
  'general.dynamique.chart-evolution-within-2-years-by-year':
    ChartEvolutionWithin2YearsByYearStudies,
  'general.dynamique.chart-evolution-within-3-years-by-year':
    ChartEvolutionWithin3YearsByYearStudies,
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
  'orcid.general.chart-evolution': OrcidEvolution,
  'orcid.general.creation-by-year': OrcidCreationByYear,
  'orcid.general.chart-indicator-worksource': ChartOrcidWorkSource,
  'orcid.general.chart-indicator-affiliationsource':
    ChartOrcidAffiliationSource,
  'orcid.general.chart-indicator-active': ChartOrcidActive,
  'orcid.general.chart-indicator-hal': ChartOrcidHal,
  'orcid.general.chart-indicator-work': ChartOrcidWork,
  'orcid.general.chart-indicator-affiliationid': ChartOrcidAffiliationId,
  'orcid.general.chart-indicator-these-year': ChartOrcidTheseYear,
  'orcid.general.chart-indicator-these-discipline': ChartOrcidTheseDiscipline,
  'orcid.general.chart-indicator-idref-abes': ChartOrcidIdrefAbes,
  'orcid.general.chart-indicator-idref-hal': ChartOrcidIdrefHal,
  'orcid.general.chart-indicator-idref-same': ChartOrcidIdrefSame,
  'orcid.general.chart-indicator-idhal-abes': ChartOrcidIdhalAbes,
  'orcid.general.chart-indicator-idhal-hal': ChartOrcidIdhalHal,
  'orcid.general.chart-indicator-idhal-same': ChartOrcidIdhalSame,
  // Other
  'publi.others.retractions.chart-by-year': RetractionsByYear,
  'publi.others.retractions.chart-by-field': RetractionsByField,
  'publi.others.retractions.chart-by-publisher': RetractionsByPublisher,
  'publi.others.retractions.chart-by-nature': RetractionsByNature,
};

export default chartComponents;

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
const ChartGenreOuverture = lazy(() => import(
  '../components/Charts/publications/general/genres-ouverture/genres-ouverture'
));
const ChartRepartitionDeclarations = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-repartition-declarations'
));
const ChartTauxOuvertureFinancement = lazy(() => import(
  '../components/Charts/publications/general/impact-financement/chart-taux-ouverture'
));
const ChartLanguesOuverture = lazy(() => import(
  '../components/Charts/publications/general/langues-ouverture/langues-ouverture'
));
const ChartEvolutionTaux = lazy(() => import(
  '../components/Charts/publications/general/voies-ouverture/chart-evolution-taux'
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
const ChartEevolutionNombreStudies = lazy(() => import(
  '../components/Charts/studies/caracteristiques/types/chart-evolution-nombre'
));
const ChartEvolutionStudies = lazy(() => import(
  '../components/Charts/studies/general/dynamique-ouverture/chart-evolution'
));
const ChartRepartitionStudies = lazy(() => import('../components/Charts/studies/general/trajectoires/chart-repartition'));
const ChartEvolutionNombreStudies = lazy(() => import(
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
  'publi.general.voies-ouverture.chart-evolution-taux': ChartEvolutionTaux,
  'publi.general.langues-ouverture.chart-repartition-publications':
    ChartLanguesOuverture,
  'publi.general.impact-financement.chart-taux-ouverture':
    ChartTauxOuvertureFinancement,
  'publi.general.impact-financement.chart-repartition-financements':
    ChartRepartitionDeclarations,
  'publi.general.genres-ouverture.chart-repartition-genres':
    ChartGenreOuverture,
  'publi.general.dynamique-ouverture.chart-taux-ouverture': ChartTauxOuverture,
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
  'publi.publishers.couts-publication.chart-distribution-par-annee':
    ChartDistributionParAnnee,
  'publi.publishers.couts-publication.chart-distribution':
    ChartDistributionPublishers,
  'publi.publishers.couts-publication.chart-depenses-estimees':
    ChartDepensesEstimeesPublishers,
  'studies.general.dynamique.chart-evolution': ChartEvolutionStudies,
  'studies.general.trajectoires.chart-repartition': ChartRepartitionStudies,
  'studies.caracteristiques.quand.chart-evolution-temporalites':
    ChartEvolutionTemporalitesStudies,
  'studies.caracteristiques.quand.chart-repartition-avant-apres':
    ChartRepartitionAvantApresStudies,
  'studies.caracteristiques.quand.chart-distribution-declarations':
    ChartDistributionDeclarationsStudies,
  'studies.caracteristiques.duree.chart-nombre': ChartNombreStudies,
  'studies.caracteristiques.combien.chart-groupes-patients':
    ChartGroupesPatientsStudies,
  'studies.caracteristiques.combien.chart-proportion-modes-repartition':
    ChartProportionModesRepartitionStudies,
  'studies.caracteristiques.types.chart-evolution-nombre':
    ChartEevolutionNombreStudies,
  'studies.promoteurs.dynamique-ouverture.chart-part': ChartPartStudies,
  'studies.promoteurs.dynamique-ouverture.chart-evolution-nombre':
    ChartEvolutionNombreStudies,
  'studies.promoteurs.impact.chart-repartition':
    ChartPromoteursRepartitionStudies,
  'studies.promoteurs.impact.chart-classement-pays': ChartClassementPaysStudies,
  'studies.resultats.type-diffusion.chart-repartition':
    ChartTypeDiffusionRepartitionStudies,
  'studies.resultats.type-diffusion.chart-repartition-par-type':
    ChartRepartitionParTypeStudies,
  'studies.resultats.plan-partage.chart-repartition':
    ChartPlanPartageRepartitionStudies,
  'studies.resultats.delai-diffusion.chart-repartition':
    ChartDelaiDiffusionRepartitionStudies,
  'studies.resultats.delai-diffusion.chart-distribution':
    ChartDistributionStudies,
  'studies.resultats.publication.chart-repartition':
    ChartResultatsRepartitionStudies,
  'studies.resultats.publication.chart-repartition-icmje':
    ChartResultatsRepartitionIcmjeStudies,
};

export default chartComponents;

import ChartEvolutionProportionAffiliations from '../components/Charts/publications/affiliations/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuvertureAffiliations from '../components/Charts/publications/affiliations/dynamique-ouverture/chart-taux-ouverture';
import ChartClassementPays from '../components/Charts/publications/affiliations/pays/chart-classement-pays';
import ChartEvolutionTauxOuvertureRangUtile from '../components/Charts/publications/affiliations/pays/chart-taux-rang-utile';
import ChartNombreDocumentsDepotsRepositories from '../components/Charts/publications/archives/dynamique-depot/chart-nombre-documents-depots';
import ChartTauxCouvertureHAL from '../components/Charts/publications/archives/dynamique-hal/chart-couverture-hal';
import ChartTauxOuvertureArchives from '../components/Charts/publications/archives/dynamique-ouverture/chart-taux-ouverture';
import ChartTauxPresenceRepositories from '../components/Charts/publications/archives/dynamique-ouverture/chart-taux-presence';
import ChartNombreDocumentsRepositories from '../components/Charts/publications/archives/plus-utilisees/chart-nombre-documents';
import ChartEvolutionTauxOuvertureDisciplines from '../components/Charts/publications/disciplines/dynamique-ouverture/chart-evolution-taux-ouverture';
import ChartTauxOuvertureDisciplines from '../components/Charts/publications/disciplines/dynamique-ouverture/chart-taux-ouverture';
import ChartEvolutionComparaisonTypesHebergementDisciplines from '../components/Charts/publications/disciplines/voies-ouverture/chart-evolution-comparaison-types-hebergement';
import ChartRepartitionPublicationsDisciplines from '../components/Charts/publications/disciplines/voies-ouverture/chart-repartition-publications';
import ChartDepensesEstimeesPublishers from '../components/Charts/publications/editeurs/couts-publication/chart-depenses-estimees';
import ChartDistributionPublishers from '../components/Charts/publications/editeurs/couts-publication/chart-distribution';
import ChartDistributionParAnnee from '../components/Charts/publications/editeurs/couts-publication/chart-distribution-par-annee';
import ChartEvolutionProportionPublishers from '../components/Charts/publications/editeurs/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverturePublishers from '../components/Charts/publications/editeurs/dynamique-ouverture/chart-taux-ouverture';
import ChartRepartitionPublishers from '../components/Charts/publications/editeurs/poids-revues/chart-repartition';
import ChartClassementPublishers from '../components/Charts/publications/editeurs/politiques-ouverture/chart-classement';
import ChartComparaisonPublishers from '../components/Charts/publications/editeurs/politiques-ouverture/chart-comparaison';
import ChartClassementLicencesPublishers from '../components/Charts/publications/editeurs/repartition-licences/chart-classement';
import ChartRepartitionLicencesPublishers from '../components/Charts/publications/editeurs/repartition-licences/chart-repartition';
import ChartEvolutionRepartitionPublishers from '../components/Charts/publications/editeurs/type-ouverture/chart-evolution-repartition';
import ChartRepartitionModelesPublishers from '../components/Charts/publications/editeurs/type-ouverture/chart-repartition-modeles';
import ChartEvolutionProportion from '../components/Charts/publications/general/dynamique-ouverture/chart-evolution-proportion';
import ChartTauxOuverture from '../components/Charts/publications/general/dynamique-ouverture/chart-taux-ouverture';
import ChartGenreOuverture from '../components/Charts/publications/general/genres-ouverture/genres-ouverture';
import ChartRepartitionDeclarations from '../components/Charts/publications/general/impact-financement/chart-repartition-declarations';
import ChartTauxOuvertureFinancement from '../components/Charts/publications/general/impact-financement/chart-taux-ouverture';
import ChartLanguesOuverture from '../components/Charts/publications/general/langues-ouverture/langues-ouverture';
import ChartEvolutionTaux from '../components/Charts/publications/general/voies-ouverture/chart-evolution-taux';
import ChartRepartitionPublications from '../components/Charts/publications/general/voies-ouverture/chart-repartition-publications';
import ChartRepartitionTaux from '../components/Charts/publications/general/voies-ouverture/chart-repartition-taux';

const chartComponents = {
  'publi.affiliations.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureAffiliations,
  'publi.affiliations.pays.chart-classement-pays': ChartClassementPays,
  'publi.affiliations.pays.chart-taux-rang-utile':
    ChartEvolutionTauxOuvertureRangUtile,
  'publi.repositories.dynamique-depot.chart-nombre-documents-depots':
    ChartNombreDocumentsDepotsRepositories,
  'publi.repositories.dynamique-hal.chart-couverture-hal':
    ChartTauxCouvertureHAL,
  'publi.repositories.dynamique-ouverture.chart-evolution-proportion':
    ChartTauxPresenceRepositories,
  'publi.repositories.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureArchives,
  'publi.general.dynamique-ouverture.chart-evolution-proportion':
    ChartEvolutionProportion,
  'publi.disciplines.voies-ouverture.chart-evolution-comparaison-types-hebergement':
    ChartEvolutionComparaisonTypesHebergementDisciplines,
  'publi.disciplines.dynamique-ouverture.chart-taux-ouverture':
    ChartTauxOuvertureDisciplines,
  'publi.repositories.plus-utilisees.chart-nombre-documents':
    ChartNombreDocumentsRepositories,
  'publi.disciplines.dynamique-ouverture.chart-evolution-taux-ouverture':
    ChartEvolutionTauxOuvertureDisciplines,
  'publi.affiliations.dynamique-ouverture.chart-evolution-proportion':
    ChartEvolutionProportionAffiliations,
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
  'publi.disciplines.voies-ouverture.chart-repartition-publications':
    ChartRepartitionPublicationsDisciplines,
};

export default chartComponents;

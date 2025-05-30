/* eslint-disable import/no-cycle -- Avoid cycle warning because of fullscreen feature */
import { lazy } from 'react';

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
  'publi.general.dynamique-ouverture.chart-taux-ouverture-book': lazy(() => import(
    '../components/Charts/publications/general/dynamique-ouverture/chart-taux-ouverture-book'
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
  'publi.others.collaborations.international-collaborations': lazy(() => import(
    '../components/Charts/publications/others/collaborations/international-collaborations'
  )),
  'general.dynamique.chart-evolution': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution'
  )),
  'general.dynamique.chart-evolution-drug': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-drug'
  )),
  'general.dynamique.chart-evolution-within-3-years': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years'
  )),
  'general.dynamique.chart-evolution-within-3-years-drug': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years-drug'
  )),
  'general.dynamique.chart-evolution-within-3-years-by-year': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years-by-year'
  )),
  'general.dynamique.chart-evolution-within-3-years-by-year-drug': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-3-years-by-year-drug'
  )),
  'general.dynamique.chart-evolution-within-1-year': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-1-year'
  )),
  'general.dynamique.chart-evolution-within-1-year-drug': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-1-year-drug'
  )),
  'general.dynamique.chart-evolution-within-1-year-by-year': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-1-year-by-year'
  )),
  'general.dynamique.chart-evolution-within-1-year-by-year-drug': lazy(() => import(
    '../components/Charts/studies/general/dynamique-ouverture/chart-evolution-within-1-year-by-year-drug'
  )),
  'general.trajectoires.chart-repartition': lazy(() => import(
    '../components/Charts/studies/general/trajectoires/chart-repartition'
  )),
  'caracteristiques.quand.chart-evolution-temporalites': lazy(() => import(
    '../components/Charts/studies/caracteristiques/quand/chart-evolution-temporalites'
  )),
  'caracteristiques.quand.chart-repartition-avant-apres': lazy(() => import(
    '../components/Charts/studies/caracteristiques/quand/chart-repartition-avant-apres'
  )),
  'caracteristiques.quand.chart-distribution-declarations': lazy(() => import(
    '../components/Charts/studies/caracteristiques/quand/chart-distribution-declarations'
  )),
  'caracteristiques.duree.chart-nombre': lazy(() => import('../components/Charts/studies/caracteristiques/duree/chart-nombre')),
  'caracteristiques.combien.chart-groupes-patients': lazy(() => import(
    '../components/Charts/studies/caracteristiques/combien/chart-groupes-patients'
  )),
  'caracteristiques.combien.chart-proportion-modes-repartition': lazy(() => import(
    '../components/Charts/studies/caracteristiques/combien/chart-proportion-modes-repartition'
  )),
  'caracteristiques.types.chart-evolution-nombre': lazy(() => import(
    '../components/Charts/studies/caracteristiques/types/chart-evolution-nombre'
  )),
  'promoteurs.dynamique-ouverture.chart-part': lazy(() => import(
    '../components/Charts/studies/promoteurs/dynamique-ouverture/chart-part'
  )),
  'promoteurs.dynamique-ouverture.chart-evolution-nombre': lazy(() => import(
    '../components/Charts/studies/promoteurs/dynamique-ouverture/chart-evolution-nombre'
  )),
  'promoteurs.impact.chart-repartition': lazy(() => import('../components/Charts/studies/promoteurs/impact/chart-repartition')),
  'promoteurs.impact.chart-classement-pays': lazy(() => import(
    '../components/Charts/studies/promoteurs/impact/chart-classement-pays'
  )),
  'resultats.type-diffusion.chart-repartition': lazy(() => import(
    '../components/Charts/studies/resultats/type-diffusion/chart-repartition'
  )),
  'resultats.type-diffusion.chart-repartition-par-type': lazy(() => import(
    '../components/Charts/studies/resultats/type-diffusion/chart-repartition-par-type'
  )),
  'resultats.plan-partage.chart-repartition': lazy(() => import(
    '../components/Charts/studies/resultats/plan-partage/chart-repartition'
  )),
  'resultats.delai-diffusion.chart-repartition': lazy(() => import(
    '../components/Charts/studies/resultats/delai-diffusion/chart-repartition'
  )),
  'resultats.delai-diffusion.chart-distribution': lazy(() => import(
    '../components/Charts/studies/resultats/delai-diffusion/chart-distribution'
  )),
  'resultats.publication.chart-repartition': lazy(() => import(
    '../components/Charts/studies/resultats/publication/chart-repartition'
  )),
  'resultats.publication.chart-repartition-icmje': lazy(() => import(
    '../components/Charts/studies/resultats/publication/chart-repartition-icmje'
  )),
  'thesis.general.voies-ouverture.chart-repartition-taux': lazy(() => import(
    '../components/Charts/thesis/general/voies-ouverture/chart-repartition-taux'
  )),
  'thesis.disciplines.dynamique-ouverture.chart-taux-ouverture': lazy(() => import(
    '../components/Charts/thesis/disciplines/dynamique-ouverture/chart-taux-ouverture'
  )),
  'thesis.disciplines.voies-ouverture.chart-repartition-thesis': lazy(() => import(
    '../components/Charts/thesis/disciplines/voies-ouverture/chart-repartition-thesis'
  )),
  // Code
  'software.general.voies-ouverture.chart-software-used': lazy(() => import(
    '../components/Charts/software/general/voies-ouverture/chart-software-used'
  )),
  'software.general.voies-ouverture.chart-software-created': lazy(() => import(
    '../components/Charts/software/general/voies-ouverture/chart-software-created'
  )),
  'software.general.voies-ouverture.chart-software-shared': lazy(() => import(
    '../components/Charts/software/general/voies-ouverture/chart-software-shared'
  )),
  'software.general.voies-ouverture.chart-software-shared-among-all': lazy(() => import(
    '../components/Charts/software/general/voies-ouverture/chart-software-shared-among-all'
  )),
  'software.disciplines.voies-ouverture.chart-software-used': lazy(() => import(
    '../components/Charts/software/disciplines/voies-ouverture/chart-software-used'
  )),
  'software.disciplines.voies-ouverture.chart-software-created': lazy(() => import(
    '../components/Charts/software/disciplines/voies-ouverture/chart-software-created'
  )),
  'software.disciplines.voies-ouverture.chart-software-shared': lazy(() => import(
    '../components/Charts/software/disciplines/voies-ouverture/chart-software-shared'
  )),
  'software.disciplines.voies-ouverture.chart-software-shared-among-all': lazy(
    () => import(
      '../components/Charts/software/disciplines/voies-ouverture/chart-software-shared-among-all'
    ),
  ),
  'software.oa.voies-ouverture.chart-software-shared': lazy(() => import(
    '../components/Charts/software/oa/voies-ouverture/chart-software-shared'
  )),
  'software.general.mentions.software-with-at-least-one-explicit-mention': lazy(
    () => import(
      '../components/Charts/software/general/mentions/software-with-at-least-one-explicit-mention'
    ),
  ),
  // Data
  'data.general.voies-ouverture.chart-data-used': lazy(() => import('../components/Charts/data/general/voies-ouverture/chart-data-used')),
  'data.general.voies-ouverture.chart-data-created': lazy(() => import(
    '../components/Charts/data/general/voies-ouverture/chart-data-created'
  )),
  'data.general.voies-ouverture.chart-data-shared': lazy(() => import(
    '../components/Charts/data/general/voies-ouverture/chart-data-shared'
  )),
  'data.general.voies-ouverture.chart-data-shared-among-all': lazy(() => import(
    '../components/Charts/data/general/voies-ouverture/chart-data-shared-among-all'
  )),
  'data.general.voies-ouverture.chart-availibility': lazy(() => import(
    '../components/Charts/data/general/voies-ouverture/chart-availibility'
  )),
  'data.disciplines.voies-ouverture.chart-data-used': lazy(() => import(
    '../components/Charts/data/disciplines/voies-ouverture/chart-data-used'
  )),
  'data.disciplines.voies-ouverture.chart-data-created': lazy(() => import(
    '../components/Charts/data/disciplines/voies-ouverture/chart-data-created'
  )),
  'data.disciplines.voies-ouverture.chart-data-shared': lazy(() => import(
    '../components/Charts/data/disciplines/voies-ouverture/chart-data-shared'
  )),
  'data.disciplines.voies-ouverture.chart-data-shared-among-all': lazy(() => import(
    '../components/Charts/data/disciplines/voies-ouverture/chart-data-shared-among-all'
  )),
  'data.disciplines.voies-ouverture.chart-availibility': lazy(() => import(
    '../components/Charts/data/disciplines/voies-ouverture/chart-availibility'
  )),
  'data.editeurs.voies-ouverture.chart-availibility': lazy(() => import(
    '../components/Charts/data/editeurs/voies-ouverture/chart-availibility'
  )),
  'data.general.mentions.datasets-with-at-least-one-explicit-mention': lazy(
    () => import(
      '../components/Charts/data/general/mentions/datasets-with-at-least-one-explicit-mention'
    ),
  ),
  'data.disciplines.mentions.datasets-with-at-least-one-explicit-mention': lazy(
    () => import(
      '../components/Charts/data/disciplines/mentions/datasets-with-at-least-one-explicit-mention'
    ),
  ),
  'data.general.repositories.datasets-by-publisher': lazy(() => import(
    '../components/Charts/data/general/repositories/datasets-by-publisher'
  )),
  'data.general.repositories.datasets-by-size': lazy(() => import('../components/Charts/data/general/repositories/datasets-by-size')),
  'data.general.repositories.datasets-by-format': lazy(() => import('../components/Charts/data/general/repositories/datasets-by-format')),
  'data.general.repositories.datasets-by-license': lazy(() => import(
    '../components/Charts/data/general/repositories/datasets-by-license'
  )),
  // Orcid
  'orcid.general.chart-evolution': lazy(() => import('../components/Charts/orcid/general/chart-evolution')),
  'orcid.general.creation-by-year': lazy(() => import('../components/Charts/orcid/general/creation-by-year')),
  'orcid.general.chart-indicator-worksource': lazy(() => import('../components/Charts/orcid/general/chart-indicator-worksource')),
  'orcid.general.chart-indicator-affiliationsource': lazy(() => import(
    '../components/Charts/orcid/general/chart-indicator-affiliationsource'
  )),
  'orcid.general.chart-indicator-active': lazy(() => import('../components/Charts/orcid/general/chart-indicator-active')),
  'orcid.general.chart-indicator-hal': lazy(() => import('../components/Charts/orcid/general/chart-indicator-hal')),
  'orcid.general.chart-indicator-work': lazy(() => import('../components/Charts/orcid/general/chart-indicator-work')),
  'orcid.general.chart-indicator-active-work': lazy(() => import('../components/Charts/orcid/general/chart-indicator-active-work')),
  'orcid.general.chart-indicator-affiliationid': lazy(() => import('../components/Charts/orcid/general/chart-indicator-affiliationid')),
  'orcid.general.chart-indicator-these-year': lazy(() => import('../components/Charts/orcid/general/chart-indicator-these-year')),
  'orcid.general.chart-indicator-these-discipline': lazy(() => import(
    '../components/Charts/orcid/general/chart-indicator-these-discipline'
  )),
  'orcid.general.chart-indicator-idref-abes': lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-abes')),
  'orcid.general.chart-indicator-idref-hal': lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-hal')),
  'orcid.general.chart-indicator-idref-same': lazy(() => import('../components/Charts/orcid/general/chart-indicator-idref-same')),
  'orcid.general.chart-indicator-idhal-abes': lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-abes')),
  'orcid.general.chart-indicator-idhal-hal': lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-hal')),
  'orcid.general.chart-indicator-idhal-same': lazy(() => import('../components/Charts/orcid/general/chart-indicator-idhal-same')),
  // Others
  'publi.others.hal-no-doi.hal-no-doi-by-field': lazy(() => import(
    '../components/Charts/publications/others/hal-no-doi/hal-no-doi-by-field'
  )),
  'publi.others.hal-no-doi.hal-no-doi-by-field-by-year': lazy(() => import(
    '../components/Charts/publications/others/hal-no-doi/hal-no-doi-by-field-by-year'
  )),
  'publi.others.retractions.chart-by-year': lazy(() => import(
    '../components/Charts/publications/others/retractions/chart-by-year'
  )),
  'publi.others.retractions.chart-by-field': lazy(() => import(
    '../components/Charts/publications/others/retractions/chart-by-field'
  )),
  'publi.others.retractions.chart-by-publisher': lazy(() => import(
    '../components/Charts/publications/others/retractions/chart-by-publisher'
  )),
  'publi.others.retractions.chart-by-nature': lazy(() => import(
    '../components/Charts/publications/others/retractions/chart-by-nature'
  )),
  'publi.others.retractions.chart-by-reason': lazy(() => import(
    '../components/Charts/publications/others/retractions/chart-by-reason'
  )),
  'publi.others.sources.publications-by-source': lazy(() => import(
    '../components/Charts/publications/others/sources/publications-by-source'
  )),
};

export default chartComponents;

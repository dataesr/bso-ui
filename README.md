# bso-ui

[![Discord Follow](https://dcbadge.vercel.app/api/server/TudsqDqTqb?style=flat)](https://discord.gg/TudsqDqTqb)
![license](https://img.shields.io/github/license/dataesr/bso-ui)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/dataesr/bso-ui)
[![Production deployment](https://github.com/dataesr/bso-ui/actions/workflows/production.yml/badge.svg)](https://github.com/dataesr/bso-ui/actions/workflows/production.yml)
[![SWH](https://archive.softwareheritage.org/badge/origin/https://github.com/dataesr/bso-ui)](https://archive.softwareheritage.org/browse/origin/?origin_url=https://github.com/dataesr/bso-ui)

Application web du Baromètre de la Science Ouverte accessible ici : 
* fr : https://barometredelascienceouverte.esr.gouv.fr/
* en : https://frenchopensciencemonitor.esr.gouv.fr/

## Requirements

* node >= 18
* npm > 7

## Boilerplate

The version number follows [semver](https://semver.org/).

To push in prod, run `npm run deploy --level=[patch|minor|major]`

## Workflow

The workflow to submit a new FOSM local variation is described in workflow.md.

## Ajouter une nouvelle icône BSSO

* Ajouter le fichier `icon-bsso-[x].svg` dans `src/components/Icon/svg` en respectant ce format de nommage
* Ajouter à la balise `<svg>` du fichier la class `icon-bsso-[x]`
* Ajouter une balise `<title>` pour l'accessibilité
* Ajouter aux balises `<path>` les classes correspondantes `class="color-1"` `class="color-2"`
* Mettre à jour la variable `$icon-bsso-max` dans `src/style/variables.scss`

### Utilisation 
```js
 <Icon
    name='icon-bsso-[x]'
    color1='blue-soft-125'
    color2='gold'
  />
```

## Utiliser le glossaire

### 1. Ajouter les clefs nécessaires dans les fichiers de langues `src/translations/fr.json` et `src/translations/en.json`

>  La balise `<glossary0>app.word</glossary0>` correspond au mot cliquable du texte dans la page

```json
{
  "app.entry": "Entry in glossary",
  "app.definition": "My definition <cta>my-link</cta>",
  "app.word": "word to click",
  "app.text": "Lorem <glossary0>app.word-1</glossary0> ip <cta>my-link</cta> sum <glossary1>app.word-2</glossary1>."
}
```

### 2. Ajouter l'entrée voulue dans `glossary.json` avec les clefs de langues correspondantes

> La clef `intlEntry` correspond au titre dans le volet Glossaire
>
> La clef `cta` est optionnelle

```json
{
    "entry": {
      "intlEntry": "app.entry",
      "intlDefinition": "app.definition",
      "cta": "https://www.this-is-my-link.com"
    }
}
```


### 3. Ajouter le composant `Glossary` dans la page

```js
import GlossaryEntries from 'glossary.json';

<Glossary entries={GlossaryEntries} />
```

### 4. Ajouter dans la page le composant `GlossaryFormattedMessage` à l'emplacement souhaité

> La props `intlKey` correspond au texte dans lequel se trouve le mot clickable
>
> La props `glossaryKeys` correspond aux clefs dans `glossary.json` (dans l'ordre dans lequel elles apparaissent dans le texte)
>
> La props `link` est optionnelle

```js
<GlossaryFormattedMessage
  intlKey='app.text'
  ctas={['https://www.link.fr']}
  glossaryKeys={['entry1', 'entry2']}
/>
```
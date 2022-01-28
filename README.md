# bso-ui

Application web du Baromètre de la Science Ouverte

![version](https://img.shields.io/github/package-json/v/dataesr/bso-ui)
![release](https://github.com/dataesr/bso-ui/actions/workflows/production.yml/badge.svg)

## Requirements

* node > 12
* npm > 7

## Boilerplate

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The version number follows [semver](https://semver.org/).

To create a new release, use `npm version patch|minor|major`.

## Scripts disponibles

* `npm start`
* `npm build`
* `npm test`
* `npm prepare`
* `npm eject`
* `npm version patch|minor|major`

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

### 1/4 Ajouter les clefs nécessaires dans les fichiers de langues `fr.json` et `en.json`

>  La balise `<glossary0>app.word</glossary0>` correspond au mot clickable du texte dans la page

```json
{
  "app.entry": "Entry in glossary",
  "app.definition": "My definition <cta>my-link</cta>",
  "app.word": "word to click",
  "app.text": "Lorem <glossary0>app.word-1</glossary0> ip <cta>my-link</cta> sum <glossary1>app.word-2</glossary1>."
}
```

### 2/4 Ajouter l'entrée voulue dans `glossary.json` avec les clefs de langues correspondantes

> La clef `intlEntry` correspond au titre dans le volet Glossaire

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


### 3/4 Ajouter le composant `Glossary` dans la page

```js
import GlossaryEntries from 'glossary.json';

<Glossary entries={GlossaryEntries} />
```

### 4/4 Ajouter dans la page le composant `GlossaryFormattedMessage` à l'emplacement souhaité

> La props `intlKey` correspond au texte dans lequel se trouve le mot clickable

> La props `glossaryKeys` correspond aux clefs dans `glossary.json` (dans l'ordre dans lequel elles apparaissent dans le texte)

> La props `link` est optionnelle

```js
<GlossaryFormattedMessage
  intlKey='app.text'
  ctas={['https://www.link.fr']}
  glossaryKeys={['entry1', 'entry2']}
/>
```

## Mise en prod

Avec `VERSION_LEVEL` qui peut valoir patch, minor ou major.

```sh
git checkout main
git pull --rebase --tags
git merge staging
npm version VERSION_LEVEL
git push origin --tags
```
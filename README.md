# bso-ui

> Application web du Baromètre de la Science Ouverte

![version](https://img.shields.io/github/package-json/v/dataesr/bso-ui)
![release](https://github.com/dataesr/bso-ui/actions/workflows/release.yml/badge.svg)

## Requirements

* node > 12

## Boilerplate

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The version number follows [semver](https://semver.org/).

To create a new release, use `npm version patch|minor|major`.

## Scripts disponibles

* `npm run start`
* `npm run build`
* `npm run test`
* `npm run prepare`
* `npm run eject`

## Ajouter une nouvelle icône BSSO

* Ajouter le fichier `icon-bsso-[x].svg` dans `src/components/Icon/svg` en respectant ce format de nommage
* Ajouter à la balise `<svg>` du fichier la class `icon-bsso-[x]`
* Ajouter une balise `<title>` pour l'accessibilité
* Ajouter aux balises `<path>` les class correspondantes `class="color-1"` `class="color-2"`
* Mettre à jour la variable `$icon-bsso-max` dans `src/style/variables.scss`

### Utilisation 
```
 <Icon
    name='icon-bsso-[x]'
    color1='blue-soft-125'
    color2='gold'
  />
```
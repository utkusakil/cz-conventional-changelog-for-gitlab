# cz-conventional-changelog

Status:
[![npm version](https://img.shields.io/npm/v/cz-conventional-changelog-for-gitlab.svg?style=flat-square)](https://www.npmjs.org/package/cz-conventional-changelog-for-gitlab)
[![npm downloads](https://img.shields.io/npm/dm/cz-conventional-changelog-for-gitlab.svg?style=flat-square)](http://npm-stat.com/charts.html?package=cz-conventional-changelog&from=2021-05-26)
[![Build Status](https://img.shields.io/travis/utkusakil/cz-conventional-changelog-for-gitlab.svg?style=flat-square)](https://travis-ci.com/utkusakil/cz-conventional-changelog-for-gitlab)

Part of the [commitizen](https://github.com/commitizen/cz-cli) family. Prompts for [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) standard and a mandatory GitLab issue.

## Configuration

### package.json

Like commitizen, you specify the configuration of cz-conventional-changelog through the package.json's `config.commitizen` key.

```json5
{
// ...  default values
    "config": {
        "commitizen": {
            "path": "./node_modules/cz-conventional-changelog",
            "disableScopeLowerCase": false,
            "disableSubjectLowerCase": false,
            "maxHeaderWidth": 100,
            "maxLineWidth": 100,
            "defaultType": "",
            "defaultScope": "",
            "defaultSubject": "",
            "defaultBody": "",
            "types": {
              ...
              "feat": {
                "description": "A new feature",
                "title": "Features"
              },
              ...
            }
        }
    }
// ...
}
```

### Environment variables

The following environment varibles can be used to override any default configuration or package.json based configuration.

* CZ_TYPE = defaultType
* CZ_SCOPE = defaultScope
* CZ_SUBJECT = defaultSubject
* CZ_BODY = defaultBody
* CZ_MAX_HEADER_WIDTH = maxHeaderWidth
* CZ_MAX_LINE_WIDTH = maxLineWidth

### Commitlint

If using the [commitlint](https://github.com/conventional-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 100.  This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.

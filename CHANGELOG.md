# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.3](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.4.2...v1.4.3) (2022-02-08)

### [1.4.2](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.4.1...v1.4.2) (2022-02-08)

### [1.4.1](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.4.0...v1.4.1) (2022-02-07)


### Bug Fixes

* provide type exports for Typescript ([36089eb](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/36089ebdd49cbde442292f066b17dcb7eb3f009e))

## [1.4.0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.3.3...v1.4.0) (2022-02-07)


### Features

* drop usage of EmberObject and Evented from MessageManager ([1679e94](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/1679e94d61a2a83170fb62ddbeabfd59d7a8d0b9))
* modularize Sass files ([ab0137c](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/ab0137c4c24e4fbe0779e50f8355fc7d0f7eae93))
* shrink ui-heading template with element helper and support block content ([c905771](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/c9057713beb52e952158843012d9f09a694285ed))
* support an icon-only situation by having the parent element supply its own block state ([5dbdd0e](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/5dbdd0ead5a65930357fa8bfac588d77d6ac856b))
* ui-alert and ui-alert-block components, tests, and stories ([8dc1848](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/8dc1848147b5de78a52241bd9f6c28033fcfb020))
* ui-alert component, tests, and stories ([cac8f4e](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/cac8f4ea4899e07eb3fd02688be60857509d4475))
* ui-heading component, tests, and stories ([9697849](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/96978493563a5bbe67cf6a632fe0339a40a52b3a))
* ui-lorem component, tests, and stories ([ccdb1d1](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/ccdb1d1fad2e5ece4ed0cd846fba077664d2abcd))
* ui-modal supports a managed ui-alert-block instance if provided a MessageManager ([f5fbe53](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/f5fbe531e856d72abffbcd14012b4a16abff3e58))
* ui-panel can be collapsed/expanded ([025fb79](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/025fb79b59e545aa42923b37e09d061664d5a607))
* ui-panel provides a ui-alert-block when given a MessageManager ([a1dd03b](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/a1dd03b13eb189ddca43ff70d1d043f4ce0f2309))
* ui-panel provides a ui-async-block when given a promise ([f14397b](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/f14397b3b5f4d35558c8d18315360a60311e53fd))


### Bug Fixes

* ensure UiButton onClick does not execute when button is disabled ([68fe79e](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/68fe79ecacc16bcb03bb7299347ab4de3d108034))
* revert to curly notation and string component invocation in ui-panel for Ember < 3.26 ([31a1850](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/31a185031f05b00b68c7de783abb08a4d9b97ebb))

### [1.3.3](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.3.2...v1.3.3) (2021-12-10)


### Bug Fixes

* move sass partials into subdirectory to avoid clobbering parent styles ([8852a86](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/8852a864a9f38f62345b80ef3feed0a1200722d1))

### [1.3.2](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.3.0...v1.3.2) (2021-12-10)


### Bug Fixes

* fix failing builds when Typedoc package is missing ([d05d358](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/d05d3587d9ac38ea9f353f3c29a8d978810b0e87))

### [1.3.1](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.3.0...v1.3.1) (2021-12-10)

## [1.3.0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.2.0...v1.3.0) (2021-12-10)


### Features

* add get-ones-index helper ([47a8edc](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/47a8edc7cae7d795141384045e5d100ba99c896f))
* export opt-in utility SASS ([6eaf93f](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/6eaf93f68577287f2318752254c224eda1036674))
* make underlying "StepFlowManager" more generic for reuse, now "ProgressManager" ([596ba40](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/596ba40d974ee24a3865e6e59dc08ecb658c1afc))
* sb-component-story blueprint to stub Storybook file ([93e2652](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/93e265207a7e28f7e28bd51c606a65c3fa050c1a))
* Storybook integration using Typedoc to generate args ([b432593](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/b43259370284935e088fca0ffb9d1e01deed330f))
* support for @yields tag to document component template yields ([7869ae8](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/7869ae8aeb5a721a55f3b6b0d048dae5bd7f706b))
* ui-panel "renderPanel" argument ([2e518a4](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/2e518a43ac365a335602623ce1fa841523a94bab))
* ui-progress-bar component ([daeec50](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/daeec500c0006f01bb7600773ee9fae8ceefcd1c))
* ui-progress-bar component and tests ([f643b3d](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/f643b3d2a6d217e2ef8d6a3f65234651b1d75772))
* ui-stepflow component ([822d779](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/822d779fea2ca2e10c01aa4d3dec3aec24c8841b))
* ui-stepflow component and tests ([45ef1ba](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/45ef1baa53ff95007fa167c5ea10824ca99aec75))


### Bug Fixes

* remove unused ember-engines-router-service dependency ([bb94f12](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/bb94f12c1bfa43e1d4971838973df99053d8cec0))

## [1.2.0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.1.0...v1.2.0) (2021-11-09)


### Features

* ui-panel and tests ([baf55c4](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/baf55c4e90284338654351c004af6256a9a0b906))

## [1.1.0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v1.0.0...v1.1.0) (2021-11-05)


### Features

* added attributes `pulse` and `pendingAnimation` to ui-icon component ([fc81cd0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/fc81cd0134ff44c2348c5e3f991afb4b7b405f9a))
* ui-async-block component and tests ([c1ba016](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/c1ba016f4cf7b790c950a005f793368cc69bf7c9))
* ui-button and tests ([5db175d](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/5db175dc8b4c8c0ac413ae5b8d5dbac5a47b1976))
* ui-load-indicator component and test ([afc606c](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/afc606ca8fbd6460667d257993b0210cacf039db))
* ui-menu and tests ([624fcf0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/624fcf0c815779298c87099084729b5e0b481294))
* ui-modal and tests ([549c86b](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/549c86be3e7754be22fc68359c70cdb52ffdd51c))
* ui-tooltip, ui-tooltip-attachment and tests ([02be21d](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/02be21d48de7cfbd7705dd4481e3d718dae70dd2))

## [1.0.0](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/compare/v0.0.0...v1.0.0) (2021-10-22)

## 0.0.0 (2021-10-21)


### Features

* ui-collapse component and test ([fad0d29](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/fad0d299987a94f0ec26f381b2f730fd173ac232))
* ui-icon component and test ([80c86c5](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/80c86c53c07a3a7d883913734ed2cda7d8743a9c))
* ui-inline-text-icon-layout component and test ([3fa4228](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/3fa4228910f130ee99cc9e54e7c23b5e82b20366))
* ui-popper component and test ([33b8c99](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/33b8c9990dd0e2fb0de799f137d47fff050f690c))
* ui-tabs component and test ([c520e8f](https://bitbucket.nsf.gov/projects/NSF-FE/repos/ui-foundation/browse/commit/c520e8f07022efc96df13e1c7dadedc467424645))

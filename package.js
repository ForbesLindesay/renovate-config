const {writeFileSync} = require('fs');
const {deepEqual} = require('assert');

const pkg = {
  name: '@forbeslindesay/renovate-config',
  publishConfig: {access: 'public'},
  repository: 'git@github.com:ForbesLindesay/renovate-config.git',
  author: 'Forbes Lindesay <forbes@lindesay.co.uk>',
  license: 'MIT',
  scripts: {
    'prettier:write':
      "prettier --ignore-path .gitignore --write './**/*.{md,json,yaml,js,jsx,ts,tsx}'",
    'prettier:check':
      "prettier --ignore-path .gitignore --list-different './**/*.{md,json,yaml,js,jsx,ts,tsx}'",
    test: 'node package --check',
  },
  devDependencies: {
    '@forbeslindesay/tsconfig': '^2.0.0',
    husky: '^4.2.5',
    prettier: '^2.0.4',
  },
  husky: {
    hooks: {
      'pre-commit': 'yarn prettier:write',
    },
  },

  'renovate-config': {
    autoMergeDevDependencies: {
      packageRules: [
        {
          depTypeList: ['devDependencies'],
          automerge: true,
        },
      ],
    },
    bumpAllExceptPeerDependencies: {
      description: 'Bump dependency versions for all except peerDependencies',
      packageRules: [
        {
          packagePatterns: ['*'],
          rangeStrategy: 'bump',
        },
        {
          depTypeList: ['engines', 'peerDependencies'],
          rangeStrategy: 'widen',
        },
      ],
    },
    base: {
      description: 'Default base configuration',
      extends: [
        ':enableRenovate',
        'schedule:weekly',
        // Automerge patch, minor and lockfile upgrades if they pass tests
        ':automergeMinor',
        '@forbeslindesay:autoMergeDevDependencies',
        '@forbeslindesay:bumpAllExceptPeerDependencies',
        // Keep Dockerfile FROM sources updated"
        ':docker',
        ':separateMajorReleases',
        ':combinePatchMinorReleases',
        ':ignoreUnstable',
        ':prImmediately',
        ':renovatePrefix',
        ':semanticPrefixFixDepsChoreOthers',
        ':updateNotScheduled',
        ':prHourlyLimit2',
        ':prConcurrentLimit20',
        'group:monorepos',
        'group:recommended',
        'helpers:disableTypesNodeMajor',
      ],
    },
  },
};

if (process.argv.includes('--check')) {
  deepEqual(
    pkg,
    require('./package.json'),
    'You must run `node package` before you commit',
  );
} else {
  writeFileSync(
    __dirname + '/package.json',
    JSON.stringify(pkg, null, '  ') + '\n',
  );
}

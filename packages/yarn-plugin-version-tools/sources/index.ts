import { Plugin, SettingsType } from '@yarnpkg/core';
import { GetChangedPackagesCommand, VersionPlusCommand } from './commands';
import { Command, Usage } from 'clipanion';
import VersionApplyCommand from 'yarn-plugin-version-fork/sources/commands/version/apply';
import VersionCheckCommand from 'yarn-plugin-version-fork/sources/commands/version/check';
import { COMMAND_NS, COMMAND_NS_SHORT } from './commands/constants';

class VTApplyCommand extends VersionApplyCommand {
  static paths = [
    [COMMAND_NS, `apply`],
    [COMMAND_NS_SHORT, 'apply']
  ];

  static usage: Usage = Command.Usage({
    category: `Release-related commands`,
    description: `apply all the deferred version bumps at once`,
    details: `
      This command will apply the deferred version changes and remove their definitions from the repository.

      Note that if \`--prerelease\` is set, the given prerelease identifier (by default \`rc.%d\`) will be used on all new versions and the version definitions will be kept as-is.

      By default only the current workspace will be bumped, but you can configure this behavior by using one of:

      - \`--recursive\` to also apply the version bump on its dependencies
      - \`--all\` to apply the version bump on all packages in the repository

      Note that this command will also update the \`workspace:\` references across all your local workspaces, thus ensuring that they keep referring to the same workspaces even after the version bump.
    `,
    examples: [
      [`Apply the version change to the local workspace`, `yarn ${COMMAND_NS} apply`],
      [
        `Apply the version change to all the workspaces in the local workspace`,
        `yarn ${COMMAND_NS} apply --all`
      ]
    ]
  });
}

class VTCheckCommand extends VersionCheckCommand {
  static paths = [
    [COMMAND_NS, `check`],
    [COMMAND_NS_SHORT, 'check']
  ];

  static usage: Usage = Command.Usage({
    category: `Release-related commands`,
    description: `check that all the relevant packages have been bumped`,
    details: `
      **Warning:** This command currently requires Git.

      This command will check that all the packages covered by the files listed in argument have been properly bumped or declined to bump.

      In the case of a bump, the check will also cover transitive packages - meaning that should \`Foo\` be bumped, a package \`Bar\` depending on \`Foo\` will require a decision as to whether \`Bar\` will need to be bumped. This check doesn't cross packages that have declined to bump.

      In case no arguments are passed to the function, the list of modified files will be generated by comparing the HEAD against \`master\`.
    `,
    examples: [[`Check whether the modified packages need a bump`, `yarn ${COMMAND_NS} check`]]
  });
}

const plugin: Plugin = {
  configuration: {
    preferDeferredVersions: {
      description: `If true, running \`yarn ${COMMAND_NS}\` will assume the \`--deferred\` flag unless \`--immediate\` is set`,
      type: SettingsType.BOOLEAN,
      default: false
    }
  },
  commands: [GetChangedPackagesCommand, VersionPlusCommand, VTApplyCommand, VTCheckCommand]
};

export default plugin;

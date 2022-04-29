import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--yes': Boolean,
      '-y': '--yes',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    template: args._[0],
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'vue-tailwind';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.packageName) {
    questions.push({
      type: 'input',
      name: 'packageName',
      message: 'Package name?',
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose which project template to use',
      choices: ['vue-tailwind', "vue-tailwind-three"],
      default: defaultTemplate,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    packageName: options.packageName || answers.packageName,
    template: options.template || answers.template,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
const editJsonFile = require("edit-json-file");

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = path.join(__dirname, "..", "/templates/", options.template.toLowerCase());
  options.templateDirectory = templateDir;
  const pkgPath = path.join(templateDir, "/package.json");
  const pkg = editJsonFile(pkgPath);
  pkg.set("name", options.packageName);
  pkg.save();
    
  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  await copyTemplateFiles(options);
  
  console.log();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  console.log('npm install');
  console.log('npm run dev');
  return true;
}
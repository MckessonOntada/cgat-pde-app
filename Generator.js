const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const validateComponentName = (name) => {
  const validPattern = /^[a-zA-Z0-9\-]+$/;
  if (!validPattern.test(name)) {
    throw new Error('Invalid component name. It should only contain alphanumeric characters and dashes (-).');
  }
};

const createComponent = (componentName) => {
  const mfeFolderPath = path.join(__dirname, 'mfe');
  const componentFolderPath = path.join(mfeFolderPath, componentName);

  if (fs.existsSync(componentFolderPath)) {
    throw new Error(`Component "${componentName}" already exists!`);
  }

  fs.mkdirSync(componentFolderPath, { recursive: true });
  fs.mkdirSync(path.join(componentFolderPath, 'src'));

  const packageJsonContent = {
    name: `@mfe/${componentName}`,
    version: '1.0.0',
    main: 'dist/bundle.js',
    scripts: {
      build: 'webpack --config webpack.config.js',
    },
    dependencies: {
      react: '^18.0.0',
    },
    devDependencies: {
      '@babel/core': '^7.0.0',
      '@babel/preset-env': '^7.0.0',
      '@babel/preset-react': '^7.0.0',
      'babel-loader': '^8.0.0',
      webpack: '^5.0.0',
      'webpack-cli': '^4.0.0',
    },
  };
  fs.writeFileSync(
    path.join(componentFolderPath, 'package.json'),
    JSON.stringify(packageJsonContent, null, 2)
  );

  const webpackConfigContent = `
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'mfe-${componentName}',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
`;
  fs.writeFileSync(path.join(componentFolderPath, 'webpack.config.js'), webpackConfigContent);

  const babelrcContent = `
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
  ]
}
`;
  fs.writeFileSync(path.join(componentFolderPath, '.babelrc'), babelrcContent);

  const indexTsContent = `
import App from "./src/App";
export default App;
`;
  fs.writeFileSync(path.join(componentFolderPath, './index.js'), indexTsContent);

  const appTsxContent = `
import React from 'react';
import './style.css';

const App = () => {
  return <div><p>Edit mfe/${componentName}/src/App.jsx and save to reload</p></div>;
};

export default App;
`;
  fs.writeFileSync(path.join(componentFolderPath, 'src/App.jsx'), appTsxContent);

  fs.writeFileSync(path.join(componentFolderPath, 'src/App.test.jsx'), '');
  fs.writeFileSync(path.join(componentFolderPath, 'src/style.css'), '');

  console.log(`Component "${componentName}" created successfully!`);
};

const addDependencyToMainApp = (componentName) => {
  const mainAppPackageJsonPath = path.join(__dirname, 'apps', 'cgat-pde', 'package.json');
  const mainAppPackageJson = JSON.parse(fs.readFileSync(mainAppPackageJsonPath, 'utf-8'));

  mainAppPackageJson.dependencies[`@mfe/${componentName}`] = '1.0.0';

  fs.writeFileSync(mainAppPackageJsonPath, JSON.stringify(mainAppPackageJson, null, 2));

  console.log(`Dependency "@mfe/${componentName}" added to main app package.json.`);
};

const importComponentIntoMainApp = (componentName) => {
  const mainAppFilePath = path.join(__dirname, 'apps', 'cgat-pde', 'src', 'App.jsx');
  let mainAppFileContent = fs.readFileSync(mainAppFilePath, 'utf-8');

  // Add import statement if it doesn't already exist
  const importStatement = `import ${componentName.replace(/-/g, '')} from '@mfe/${componentName}';\n`;
  if (!mainAppFileContent.includes(importStatement)) {
    mainAppFileContent = importStatement + mainAppFileContent;
  }

  const renderStatement = `<${componentName.replace(/-/g, '')} />`;
  if (!mainAppFileContent.includes(renderStatement)) {
    mainAppFileContent = mainAppFileContent.replace(
      '</div>',
      `  ${renderStatement}\n</div>`
    );
  }

  fs.writeFileSync(mainAppFilePath, mainAppFileContent);

  console.log(`Component "@mfe/${componentName}" imported into main app.`);
};

const installDependencies = (componentName) => {
  const componentFolderPath = path.join(__dirname, 'mfe', componentName);
  console.log(`Installing dependencies for "${componentName}"...`);

  exec('yarn install', { cwd: componentFolderPath }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error installing dependencies for ${componentName}:`, err);
      return;
    }
    console.log(stdout);
    console.log(`Dependencies for "${componentName}" installed successfully!`);

    exec('yarn install', { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) {
        console.error('Error running yarn install in root folder:', err);
        return;
      }
      console.log('Root dependencies updated successfully!');
    });
  });
};

const main = () => {
  const componentName = process.argv[2];

  if (!componentName) {
    console.error('Error: Please provide a component name.');
    process.exit(1);
  }

  try {
    validateComponentName(componentName);
    createComponent(componentName);
    // addTypeFileToMainApp(componentName);
    addDependencyToMainApp(componentName);
    // importComponentIntoMainApp(componentName);
    installDependencies(componentName);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

main();

  

##  Cgat-pde

  

This project is a monorepo structure with micro-frontend (MFE) components and a main React app. The MFE components are built and imported into the main app for rendering.

  

##  Commands

  

###  1. Generate MFE Component

  

You can create a new MFE component using the following command:

  

```
yarn  generate:component  <component_name>
```

  

- Replace `<component_name>` with the name of the new component.

- This will generate a new MFE component inside the `mfe` folder.

- The newly created component will be ready for use in the main app.

  

###  2. Run the App

  

To start the development server and run the main React app, use:

  

```
yarn  start
```

  

- This will start the application locally.

- Open your browser and go to `http://localhost:3000` to view the app.

  

##  Structure

  

-  `apps/` contains the main React application.

-  `mfe/` contains micro-frontend components that can be imported into the main app.

  

##  Getting Started

  

1. Clone the repository.

2. Install dependencies: `yarn install`

3. Create a new MFE component using `yarn generate:component`.

4. Start the app with `yarn start`.



##  Packages Installation at Root level

- To add dependencies to the workspace root, you can run: `yarn add <package-name> -W`
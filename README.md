# CGAT-PDE

## Setup

git clone https://github.com/mckesson/cgat-pde-app

### Pre-Requisites

- Yarn 
- Node

### Installation

```bash
yarn
```

### Adding workspace dependencies

```bash
yarn workspace <workspace_name> <command>
```

This will run the chosen Yarn command in the selected workspace.

Example:

```bash
yarn workspace apps/cgat-pde add react-router-dom --dev
```

This will add `react-router-dom` as `dependencies` in your `apps/cgat-pde/package.json`. To remove dependency use `remove` instead of add

## Usage

### Starting Project in Workspace

From your project root type start command for desired app

```bash
yarn workspace @apps/cgat-pde start
```
or 


```bash
cd apps/cgat-pde
npm start
```

All available `start` scripts

```json
"scripts": {
    "start:cgat-pde": "yarn workspace @apps/cgat-pde start",
  }
```
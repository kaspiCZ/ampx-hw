# AmpX assignment - Budget Control app

A simple budgeting app to track incomes and expenses

# Installation

## Dependencies

Using [Volta](https://volta.sh/) is strongly recommended as it simplifies Node.js version handling. Then `npm i` should provide everything necessary.

## Prerequisites

Needs you to set up Firebase with Cloud Firestore. Copy `.env.sample` and rename to `.env.local` and fill in your Cloud Firestore configuration.

These are the recommended Firestore rules for multi-user environment:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  	match /transactions/{transaction} {
    	allow write: if request.auth != null // && request.auth.uid == request.resource.data.uid
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid
    }

    match /tags/{tag} {
    	allow write: if request.auth != null // && request.auth.uid == request.resource.data.uid
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Note: The commented out rules are not yet tested and should tighten security.

You will need these composite indexes added:

```
transactions 	uid Ascending date Descending __name__ Descending	Collection
transactions 	uid Ascending date Ascending __name__ Ascending	Collection
```

## Usage

The app uses [Vite.js](https://vitejs.dev), [Vitest](https://vitest.dev). You can find more details in their respective documentation.

You can either run the app in development `npm run dev`

or build and preview `npm run build` 👉 `npm run preview`

# Hosted on Netlify

[![Netlify Status](https://api.netlify.com/api/v1/badges/c3d48dd5-fba9-4863-ae7e-e34cee878a20/deploy-status)](https://app.netlify.com/sites/teal-praline-3ce873/deploys)

https://teal-praline-3ce873.netlify.app/

`netlify.toml` specifies config for Netlify deployments (node and npm versions among others).

`public/_redirects` currently contains set up for SPAs with index redirect

# Next steps

## Features

Route to display a paginated and filterable list of all transactions

Route to manage tags (deletion)

Ability to set up a timeframe for the graph

Different graphs to better represent the data

Ability to set budget constraints and reflect those in graph (e.g. "weekly food spending")

## Technical

Set up `public/_headers` CSP and iframe headers to harden security

Use Suspense with the data loading

Use Error boundaries

Extract data handling to separate scripts for easier mocking

Improve test coverage of the Modal with form

Custom MUI theme (palette, etc.)

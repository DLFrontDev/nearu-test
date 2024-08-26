# Near.U Code Challenge

Hosted at [netlify](https://prismatic-pithivier-df84b3.netlify.app/)

## Project overview

The application intends to display information about shows and episodes based on the [TVMaze API](https://www.tvmaze.com/api). Despite being requested to display The Powerpuff Girls show data, the app can also display data from other shows, as evidenced by the quick access links on the menu bar.

### Resources

- Framework: Vue
- Routing: Vue-router
- State management: Pinia
- CSS framework: SCSS
- Testing: Vitest

### Views

#### Show

Displays show information, list of seasons and associated episodes, fetching show and season data on initial load. The seasons are switched using a series of buttons to view associated episodes, triggering episode list data fetches. Episode detail views can be navigated to using the episode list items, clicking anywhere on the list item. When a season query parameter is included in the url, the matching season is selected.

Displayed show information includes:

- Title
- Cover image
- Show type
- Airing period
- Summary

Displayed season information includes:

- Number of episodes

Displayed episode information includes:

- Episode number or Special denomination
- Name
- Runtime
- Airdate

#### Episode

Displays episode information. A back button is included, navigating the user back to the show view with an associated season query parameter. When the page is accessed without going through the show page first, a single episode fetch is performed.

Displayed episode information includes:

- Title
- Cover image
- Runtime
- Airdate
- Summary

### Data fetching

The app is built with data fetching economy in mind, reducing the number of fetches when information is already present within the store. The show data endpoint uses an embed parameter to include season data in the show data fetch.

#### Endpoints

API base url: api.tvmaze.com

- Show data: /shows/${showId}?embed=seasons
- Episode list: /seasons/${seasonId}/episodes
- Episode data: /episodes/${episodeId}

## Commands

### dev

Runs application in local mode for development

```
npm run dev
```

### test

Runs the testing suite using vitest

```
npm run test
```

### deploy:preview

Deploys application to netlify in preview mode

```
npm run deploy:preview
```

### deploy:prd

Deploys application to netlify in production mode

```
npm run deploy:prd
```

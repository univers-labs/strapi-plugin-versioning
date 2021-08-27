/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';

// Utils
import pluginId from '../../pluginId';

// Containers
import HomePage from '../HomePage';
import DiffPage from '../DiffPage';

const App = () => (
  <Switch>
    <Route exact path={`/plugins/${pluginId}/:collectionId/:entryId`} component={HomePage} />
    <Route exact path={`/plugins/${pluginId}/:collectionId/:entryId/:versionId`} component={DiffPage} />
    <Route component={NotFound} />
  </Switch>
);

export default App;

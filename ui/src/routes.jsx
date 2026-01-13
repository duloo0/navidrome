import React from 'react'
import { Route } from 'react-router-dom'
import Personal from './personal/Personal'
import LibraryRadioView from './libraryRadio/LibraryRadioView'

const routes = [
  <Route exact path="/personal" render={() => <Personal />} key={'personal'} />,
  // Library Radio routes
  <Route
    exact
    path="/libraryRadio/:type"
    render={() => <LibraryRadioView />}
    key={'libraryRadio'}
  />,
  <Route
    exact
    path="/libraryRadio/decade/:fromYear-:toYear"
    render={() => <LibraryRadioView />}
    key={'libraryRadioDecade'}
  />,
]

export default routes

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Index from './index/index';
import Update from './update';
import Detail from './detail';

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product/index" component={Index}></Route>
        <Route path="/product/update" component={Update}></Route>
        <Route path="/product/detail" component={Detail}></Route>
        <Redirect to="/product/index"/>
      </Switch>
    )
  }
}
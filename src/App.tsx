import * as React from 'react';

import Router from './components/Router';
import SessionStore from './stores/sessionStore';
import SignalRAspNetCoreHelper from './lib/signalRAspNetCoreHelper';
import Stores from './stores/storeIdentifier';
import { inject } from 'mobx-react';
import * as moment from 'moment';
import localization from './lib/localization';
import timingHelper from './lib/timingHelper';

export interface IAppProps {
  sessionStore?: SessionStore;
}

@inject(Stores.SessionStore)
class App extends React.Component<IAppProps> {
  async componentDidMount() {
    timingHelper.initTiming();
    moment.locale(localization.getCurrentLanguage());

    await this.props.sessionStore!.getCurrentLoginInformations();

    if (
      !!this.props.sessionStore!.currentLogin.user &&
      this.props.sessionStore!.currentLogin.application.features['SignalR']
    ) {
      if (this.props.sessionStore!.currentLogin.application.features['SignalR.AspNetCore']) {
        SignalRAspNetCoreHelper.initSignalR();
      }
    }

    if (localization.isRTL()) require('./styles/rtl.css');
    else require('./styles/ltr.css');
  }

  public render() {
    return <Router />;
  }
}

export default App;

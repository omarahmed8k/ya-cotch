import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './App';
import Utils from './utils/utils';
import abpUserConfigurationService from './services/abpUserConfigurationService';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.less';
import './styles/shared.css';

declare let abp: any;

Utils.setLocalization();

abpUserConfigurationService.getAll().then((data) => {
  Utils.extend(true, abp, data.data.result);
  abp.clock.provider = Utils.getCurrentClockProvider(data.data.result.clock.provider);

  // if (abp.clock.provider.supportsMultipleTimezone) {
  //   moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
  // }

  const stores = initializeStores();

  ReactDOM.render(
    <Provider {...stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

  registerServiceWorker();
});

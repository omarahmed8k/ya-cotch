import { notification } from 'antd';
import { L } from '../i18next';
import localization from './localization';

export function notifySuccess(description = L('SuccessfulNotificationMessage')) {
  let successfulNotificationArgs = {
    message: L('Done'),
    duration: 6,
  };

  notification.success({ ...successfulNotificationArgs, description,className: localization.isRTL() ? 'notification-rtl': 'notification-ltr', });
}

export function notifyFailure(description = L('SorrySomethingWentWrong')) {
  let failureNotificationArgs = {
    message: L('Oops!'),
    duration: 5,
  };

  notification.error({ ...failureNotificationArgs, description });
}


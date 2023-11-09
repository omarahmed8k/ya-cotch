import { Modal } from "antd";
import { L } from '../i18next';
import localization from "./localization";


export function popupConfirm(onOk: () => void, content = L("AreYouSure?"), title = L('PleaseConfirm'), onCancel = () => {}){
    Modal.confirm({
        title,
        content,
        onOk,
        onCancel,
        zIndex: 50000,
        cancelText : L('Cancel'),
        okText:L('OK'),
        className:localization.isRTL() ? 'rtl' :'ltr'
      });
}
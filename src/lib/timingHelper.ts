import i18n from 'i18next';
import moment from 'moment';
import localization from './localization';

class TimingHelper {
    defaultDateTimeFormat = 'D/MM/YYYY - h:mm A';
    defaultTimeFormat = 'hh:mm A';
    defaultDateFormat = 'D/MM/YYYY';

    initTiming() {
        moment.updateLocale(i18n.language, localization.getMomentLocals());
    }
    getDay(input: number): string {
        if (input < 0 || input > 6) {
            console.log('day of week out of range error ');
            return '';
        }
        return localization.getMomentLocals().weekdays[input];
    }
}

export default new TimingHelper();
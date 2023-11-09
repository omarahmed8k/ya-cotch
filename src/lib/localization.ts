import i18n from "i18next";
import { L, LanguagesMeta } from "../i18next";

class Localization {
    isRTL = (): boolean => {
        for(let i=0;i<LanguagesMeta.length;i++)
            if(LanguagesMeta[i].name === i18n.language)
                return LanguagesMeta[i].isRTL;
        return false;
    }

    getCurrentLanguage() {
        return i18n.language;
    }

    getLanguages() {
        return LanguagesMeta;
    }


    getFloat = (reversed: boolean = false) => {
        if(this.isRTL())
            return reversed ? 'right' : 'left';
        else
            return reversed ? 'left' : 'right';
    }
 
    getMomentLocals = (): any =>{
        return {
            relativeTime : this.relativeTimeOfCurrentLanguage(),
            meridiem : function (hour: number) {
                if (hour < 12) 
                    return i18n.t('AM');
                else 
                    return i18n.t('PM');
            },
            weekdays : [L('Sunday'), L('Monday'), L('Tuesday'), L('Wednesday'), L('Thursday'), L('Friday'), L('Saturday')],
           
        };
    }

    relativeTimeOfCurrentLanguage = (): any => {
        if (i18n.language === 'ar')
            return {
                future: 'خلال %s',
                past: 'منذ %s',
                s: 'ثوان قليلة',
                ss: '%d ثوان',
                m: 'دقيقة',
                mm: '%d دقائق',
                h: 'ساعة',
                hh: '%d ساعات',
                d: 'يوم',
                dd: '%d أيام',
                M: 'شهر',
                MM: '%d أشهر',
                y: 'سنة',
                yy: '%d سنوات'
            };
        else
            return {
                future: 'in %s',
                past: '%s ago',
                s: 'a few seconds',
                ss: '%d seconds',
                m: 'a minute',
                mm: '%d minutes',
                h: 'an hour',
                hh: '%d hours',
                d: 'a day',
                dd: '%d days',
                M: 'a month',
                MM: '%d months',
                y: 'a year',
                yy: '%d years'
            };
    }

}

export default new Localization();
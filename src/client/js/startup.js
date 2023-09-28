/*
 * pwix:editor/src/client/js/startup.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

Meteor.startup(() => {
    if( Meteor.CookieManager ){
        Meteor.CookieManager.publish({
            responsible: COOKIE_RESPONSIBLE,
            name: COOKIE_SWITCH_STATE,
            description: pwixI18n.label( I18N, 'cookies.switch_state' ),
            category: Meteor.CookieManager.C.Category.FUNCTIONALS,
            lifetime: pwixI18n.label( I18N, 'cookies.illimited' ),
            disableable: true
        });
    }
});

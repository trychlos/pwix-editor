/*
 * pwix:editor/src/client/js/store.js
 *
 * Manage cookies, either directly in localStorage, or via CookieManager if present.
 * NB: at the moment, all cookies are global to the application - do not use any dynamic name
 */

import _ from 'lodash';

import { check, Match } from 'meteor/check';

Editor._store = _.merge( Editor._store || {}, {
    // the Cookie instances stored at startup
    _cookies: {},

    /*
     * @locus Client
     * @param {String} name the cookie name
     * @param {String} dyn the tabular name
     * @returns {String} the identifier to be used without CookieManager
     */
    _identifier( name, dyn ){
        check( name, Match.NonEmptyString );
        //check( dyn, Match.NonEmptyString );
        let str = COOKIE_RESPONSIBLE + '/' + name;
        if( dyn ){
            str += '/' + dyn;
        }
        return str;
    },

    /**
     * @locus Client
     * @param {String} name the cookie name
     * @param {String} dyn the tabular name
     * @returns {Any} returns the value found for the named cookie and the provided dynamic name
     */
    get( name, dyn ){
        check( name, Match.NonEmptyString );
        //check( dyn, Match.NonEmptyString );
        if( this._cookies[name] ){
            return this._cookies[name].value({ dyn });
        }
        const identifier = this._identifier( name, dyn );
        return localStorage.getItem( identifier );
    },

    /**
     * @locus Client
     * @param {String} name the cookie name
     * @param {String} dyn the tabular name
     * @param {Any} value
     * @returns {Boolean} whether the value has been successfully recorded
     */
    set( name, dyn, value ){
        check( name, Match.NonEmptyString );
        //check( dyn, Match.NonEmptyString );
        if( this._cookies[name] ){
            return this._cookies[name].value( value, { dyn });
        }
        const identifier = this._identifier( name, dyn );
        localStorage.setItem( identifier, value );
        return true;
    }
});

Meteor.startup(() => {
    if( Meteor.CookieManager ){
        Editor._store._cookies[COOKIE_SWITCH_STATE] = Meteor.CookieManager.publish({
            responsible: COOKIE_RESPONSIBLE,
            name: COOKIE_SWITCH_STATE,
            description: pwixI18n.label( I18N, 'cookies.switch_state' ),
            category: Meteor.CookieManager.C.Category.FUNCTIONALS,
            lifetime: pwixI18n.label( I18N, 'cookies.illimited' )
        });
    }
});

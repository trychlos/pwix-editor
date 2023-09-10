/*
 * pwix:editor/src/client/js/startup.js
 */

import { Mongo } from 'meteor/mongo';
import { pwixI18n } from 'meteor/pwix:i18n';

Meteor.startup( function(){
    //console.log( Editor );
    // define the cient-side collections
    if( Editor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.debug( 'pwix:editor defining client-side collections...' );
    }
    Object.keys( Editor.collections ).every(( c ) => {
        //console.log( c );
        //console.log( Editor );
        const _name = Editor._conf.collections.prefix + Editor.collections[c].name;
        if( Editor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        Editor.collections[c].client = new Mongo.Collection( _name );
        Editor.collections[c].client.attachSchema( Editor.collections[c].schema );
        return true;
    });
});

Meteor.startup(() => {
    if( Meteor.cookieManager && Editor._conf.storeSwitchState ){
        Meteor.cookieManager.publish({
            name: COOKIE_SWITCH_STATE,
            responsible: 'pwix:Editor',
            description: pwixI18n.label( I18N, 'cookies.switch_state' ),
            category: 'CM_CAT_FUNCTIONALS',
            lifetime: pwixI18n.label( I18N, 'cookies.illimited' ),
            disableable: true
        });
    }
});

/*
 * pwix:editor/src/client/js/startup.js
 */

import { Mongo } from 'meteor/mongo';
import { pwixI18n } from 'meteor/pwix:i18n';

Meteor.startup( function(){
    //console.log( Editor );
    // define the cient-side collections
    if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
        console.debug( 'pwix:editor defining client-side collections...' );
    }
    Object.keys( Editor.collections ).every(( c ) => {
        //console.log( c );
        //console.log( Editor );
        const _name = Editor._conf.collections.prefix + Editor.collections[c].name;
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        Editor.collections[c].client = new Mongo.Collection( _name );
        Editor.collections[c].client.attachSchema( Editor.collections[c].schema );
        return true;
    });
});

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

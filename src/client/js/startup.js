/*
 * pwix:editor/src/client/js/startup.js
 */

import { Mongo } from 'meteor/mongo';
import { pwixI18n } from 'meteor/pwix:i18n';

Meteor.startup( function(){
    //console.log( teEditor );
    // define the cient-side collections
    if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.debug( 'pwix:editor defining client-side collections...' );
    }
    Object.keys( teEditor.collections ).every(( c ) => {
        //console.log( c );
        //console.log( teEditor );
        const _name = teEditor._conf.collections.prefix + teEditor.collections[c].name;
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        teEditor.collections[c].client = new Mongo.Collection( _name );
        teEditor.collections[c].client.attachSchema( teEditor.collections[c].schema );
        return true;
    });
});

Meteor.startup(() => {
    if( Meteor.cookieManager && teEditor._conf.storeSwitchState ){
        Meteor.cookieManager.publish({
            name: COOKIE_SWITCH_STATE,
            responsible: 'pwix:teEditor',
            description: pwixI18n.label( I18N, 'cookies.switch_state' ),
            category: 'CM_CAT_FUNCTIONALS',
            lifetime: pwixI18n.label( I18N, 'cookies.illimited' ),
            disableable: true
        });
    }
});

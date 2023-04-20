/*
 * pwix:editor/src/client/js/startup.js
 */

import { Mongo } from 'meteor/mongo';

Meteor.startup( function(){
    //console.log( pwiEditor );
    // define the cient-side collections
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.log( 'pwix:editor defining client-side collections...' );
    }
    Object.keys( pwiEditor.collections ).every(( c ) => {
        //console.log( c );
        //console.log( pwiEditor );
        const _name = pwiEditor.conf.collections.prefix + pwiEditor.collections[c].name;
        if( pwiEditor.conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.log( '   '+c+' -> '+_name );
        }
        pwiEditor.collections[c].client = new Mongo.Collection( _name );
        pwiEditor.collections[c].client.attachSchema( pwiEditor.collections[c].schema );
        return true;
    });
});

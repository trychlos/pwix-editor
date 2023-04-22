/*
 * pwix:editor/src/server/js/startup.js
 */

import { Mongo } from 'meteor/mongo';

Meteor.startup( function(){
    // define the server-side collections
    if( pwiEditor.conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.debug( 'pwix:editor defining server-side collections...' );
    }
    Object.keys( pwiEditor.collections ).every(( c ) => {
        const _name = pwiEditor.conf.collections.prefix + pwiEditor.collections[c].name;
        if( pwiEditor.conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        pwiEditor.collections[c].server = new Mongo.Collection( _name );
        pwiEditor.collections[c].server.attachSchema( pwiEditor.collections[c].schema );
        pwiEditor.collections[c].deny();
        return true;
    });
});

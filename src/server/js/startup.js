/*
 * pwix:editor/src/server/js/startup.js
 */

import { Mongo } from 'meteor/mongo';

Meteor.startup( function(){
    // define the server-side collections
    if( Editor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.debug( 'pwix:editor defining server-side collections...' );
    }
    Object.keys( Editor.collections ).every(( c ) => {
        const _name = Editor._conf.collections.prefix + Editor.collections[c].name;
        if( Editor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        Editor.collections[c].server = new Mongo.Collection( _name );
        Editor.collections[c].server.attachSchema( Editor.collections[c].schema );
        Editor.collections[c].deny();
        return true;
    });
});

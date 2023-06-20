/*
 * pwix:editor/src/server/js/startup.js
 */

import { Mongo } from 'meteor/mongo';

Meteor.startup( function(){
    // define the server-side collections
    if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.debug( 'pwix:editor defining server-side collections...' );
    }
    Object.keys( teEditor.collections ).every(( c ) => {
        const _name = teEditor._conf.collections.prefix + teEditor.collections[c].name;
        if( teEditor._conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        teEditor.collections[c].server = new Mongo.Collection( _name );
        teEditor.collections[c].server.attachSchema( teEditor.collections[c].schema );
        teEditor.collections[c].deny();
        return true;
    });
});

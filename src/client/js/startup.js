/*
 * pwix:editor/src/client/js/startup.js
 */

import { Mongo } from 'meteor/mongo';

Meteor.startup( function(){
    //console.log( teEditor );
    // define the cient-side collections
    if( teEditor.conf.verbosity & TE_VERBOSE_COLLECTIONS ){
        console.debug( 'pwix:editor defining client-side collections...' );
    }
    Object.keys( teEditor.collections ).every(( c ) => {
        //console.log( c );
        //console.log( teEditor );
        const _name = teEditor.conf.collections.prefix + teEditor.collections[c].name;
        if( teEditor.conf.verbosity & TE_VERBOSE_COLLECTIONS ){
            console.debug( '   '+c+' -> '+_name );
        }
        teEditor.collections[c].client = new Mongo.Collection( _name );
        teEditor.collections[c].client.attachSchema( teEditor.collections[c].schema );
        return true;
    });
});

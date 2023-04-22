/*
 * pwix:editor/src/common/js/config.js
 */

import { ReactiveVar } from 'meteor/reactive-var';

import merge from 'merge';

pwiEditor = {

    // client private data
    client: {},

    // collections
    collections: {},

    // configuration
    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        pwiEditor.conf = merge.recursive( true, pwiEditor.conf, o );
        if( pwiEditor.conf.verbosity & TE_VERBOSE_CONFIGURE ){
            console.debug( 'pwix:editor configure() with', o, 'building', pwiEditor.conf );
        }
    },

    // toggle switch
    switch: {
        exists: new ReactiveVar( false ),
        state: new ReactiveVar( false )
    }
};

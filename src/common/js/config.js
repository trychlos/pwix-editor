/*
 * pwix:editor/src/common/js/config.js
 */

import merge from 'merge';

teEditor = {

    // collections
    collections: {},

    // configuration
    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        teEditor.conf = merge.recursive( true, teEditor.conf, o );
        if( teEditor.conf.verbosity & TE_VERBOSE_CONFIGURE ){
            console.debug( 'pwix:editor configure() with', o, 'building', teEditor.conf );
        }
    }
};

/*
 * pwix:editor/src/common/js/config.js
 */

//console.log( 'pwix:editor/src/common/js/config.js declaring global exported pwiEditor object' );

pwiEditor = {
    // client-specific data and functions
    client: {},

    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:editor configure() with', o );
        pwiEditor.conf = {
            ...pwiEditor.conf,
            ...o
        };
    },

    // server-specific data and functions
    server: {}
};

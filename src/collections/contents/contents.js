/*
 * pwix:editor/src/collections/contents/contents.js
 *
 * The actual collection name is prefixed, and this prefix is configurable.
 * Because the actual collection name is only known after the configuration, we cannot define here the Mongo collection,
 *  but have to define both client and server-side collections at startup time.
 */

import SimpleSchema from 'simpl-schema';

pwiEditor.collections.Contents = {

    // name radical
    name: 'contents',

    // collection schema
    schema: new SimpleSchema({
        // a mnemonic identifier signifiant for the user
        // mandatory at creation time
        name: {
            type: String
        },
        content: {
            type: String,
            optional: true
        },
        // creation timestamp
        // mandatory
        createdAt: {
            type: Date,
            defaultValue: new Date()
        },
        // creation author
        createdBy: {
            type: String,
            optional: true
        },
        // last update timestamp
        updatedAt: {
            type: Date,
            optional: true
        },
        // last update author
        updatedBy: {
            type: String,
            optional: true
        },
        // Mongo identifier
        // mandatory (auto by Meteor+Mongo)
        _id: {
            type: String,
            optional: true
        },
        xxxxxx: {   // unused key to be sure we always have something to unset
            type: String,
            optional: true
        }
    }),

    // Deny all client-side updates
    // cf. https://guide.meteor.com/security.html#allow-deny
    // @locus Server
    deny(){
        pwiEditor.collections.Contents.server.deny({
            insert(){ return true; },
            update(){ return true; },
            remove(){ return true; },
        });
    },

    // client and server below will host the respective Mongo collections
    client: null,
    server: null
};

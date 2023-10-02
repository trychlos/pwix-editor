/*
 * pwix:editor/src/collections/contents/contents.js
 *
 * The actual collection name is configurable.
 * Because the actual collection name is only known at runtime, we cannot define here the Mongo collection,
 *  but have to define both client and server-side collections at each use.
 * 
 * See Contents.methods and common/init/collections.js
 */

import SimpleSchema from 'simpl-schema';

import '../../common/js/index.js';

Editor.collections.Contents = {

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
    })
};

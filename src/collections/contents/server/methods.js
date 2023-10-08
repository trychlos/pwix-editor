/*
 * pwix:editor/src/collections/contents/server/methods.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Contents } from '../contents.js';

Meteor.methods({
    // empty the collection
    'te_contents.empty'( collection_name ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.empty expects collection_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.empty() call with collection='+collection_name );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = collection.remove({});
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.empty() returns with', res );
        }
        return res;
    },

    // get some content from the database
    'te_contents.byName'( collection_name, document_name ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.byName expects collection_name be a non-empty string' );
        assert( document_name && _.isString( document_name ) && document_name.length, 'te_contents.byName expects document_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.byName() call with collection='+collection_name, 'document='+document_name );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = collection.findOne({ name: document_name });
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.byName() returns with', res );
        }
        return res;
    },

    // import an element (so do not modify any data) 
    'te_contents.import'( collection_name, elt ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.import expects collection_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.import() call with elt=', elt );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = collection.insert( elt );
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.import() returns with', res );
        }
        return res;
    },

    // set some content into the database
    // name is mandatory
    'te_contents.set'( collection_name, document_name, content ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.byName expects collection_name be a non-empty string' );
        assert( document_name && _.isString( document_name ) && document_name.length, 'te_contents.byName expects document_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.set() call with collection='+collection_name, 'document='+document_name, 'content=', content );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        let o = collection.findOne({ name: document_name }) || {};
        if( o._id ){
            //console.debug( 'content.set setting updatedAt' );
            o.updatedAt = new Date();
            o.updatedBy = this.userId;
            // make sure we have a createdBy data after schema modification
            if( !o.createdBy ){
                o.createdBy = this.userId;
            }
        } else {
            //console.debug( 'content.set setting createdAt' );
            o.createdAt = new Date();
            o.createdBy = this.userId;
        }
        o.content = content;
        //console.debug( 'orig', orig );
        //console.debug( 'o', o );
        let res = collection.upsert({ name: document_name }, { $set: o });
        if( res.numberAffected > 0 ){
            res.written = collection.findOne({ name: document_name });
        }
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.set() returns with', res );
        }
        return res;
    }
});

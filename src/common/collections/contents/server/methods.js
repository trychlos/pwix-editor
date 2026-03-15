/*
 * pwix:editor/src/common/collections/contents/server/methods.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Logger } from 'meteor/pwix:logger';

const logger = Logger.get();

Meteor.methods({
    // empty the collection
    async 'pwix.Editor.m.emptyContent'( collection_name ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'pwix.Editor.m.emptyContent expects collection_name be a non-empty string' );
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.emptyContent() called with collection='+collection_name );

        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = await collection.removeAsync({});

        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.emptyContent() returns with', res );
        return res;
    },

    // get some content from the database
    async 'pwix.Editor.m.byName'( collection_name, document_name ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'pwix.Editor.m.byName expects collection_name be a non-empty string' );
        assert( document_name && _.isString( document_name ) && document_name.length, 'pwix.Editor.m.byName expects document_name be a non-empty string' );
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.byName() called with collection='+collection_name, 'document='+document_name );

        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = await collection.findOneAsync({ name: document_name });

        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.byName() returns with', res );
        return res;
    },

    // import an element (so do not modify any data) 
    async 'pwix.Editor.m.import'( collection_name, elt ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'pwix.Editor.m.import expects collection_name be a non-empty string' );
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.import() called with elt=', elt );

        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = await collection.insertAsync( elt );

        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.import() returns with', res );
        return res;
    },

    // set some content into the database
    // name is mandatory
    // returns the result of the upsert
    async 'pwix.Editor.m.set'( collection_name, document_name, content ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'pwix.Editor.m.byName expects collection_name be a non-empty string' );
        assert( document_name && _.isString( document_name ) && document_name.length, 'pwix.Editor.m.byName expects document_name be a non-empty string' );
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.set() called with collection='+collection_name, 'document='+document_name, 'content=', content );

        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const o = await collection.findOneAsync({ name: document_name });
        o = o || {};
        if( o._id ){
            //logger.debug( 'content.set setting updatedAt' );
            o.updatedAt = new Date();
            o.updatedBy = this.userId;
            // make sure we have createdAt/createdBy datas after schema modification
            if( !o.createdAt ){
                o.createdAt = new Date();
            }
            if( !o.createdBy ){
                o.createdBy = this.userId;
            }
        } else {
            //logger.debug( 'content.set setting createdAt' );
            o.createdAt = new Date();
            o.createdBy = this.userId;
        }
        o.content = content;
        //logger.debug( 'orig', orig );
        //logger.debug( 'o', o );
        const res = await collection.upsertAsync({ name: document_name }, { $set: o });
        const doc = res.numberAffected > 0 ? await collection.findOneAsync({ name: document_name }) : res;
        logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'pwix.Editor.m.set() returns with', res );
        return res
    },

    // instanciates Tabular.Table for tabular display
    // note that we must not return the instance itself as it would lead to a circular references which makes Meteor crashes when trying to ijsonable it
    // (more we do not care of the server instance when called from by the client, just want know that is is defined)
    async 'pwix.Editor.m.hasTabular'( collection_name ){
        const tabular = await Editor.collections.Contents.getTabular( collection_name );
        return Boolean( tabular );
    }
});

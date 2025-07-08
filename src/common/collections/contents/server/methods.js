/*
 * pwix:editor/src/common/collections/contents/server/methods.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

Meteor.methods({
    // empty the collection
    // returns a Promise
    'te_contents.empty'( collection_name ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.empty expects collection_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.empty() call with collection='+collection_name );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = collection.removeAsync({});
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.empty() returns with', res );
        }
        return res;
    },

    // get some content from the database
    // returns a Promise
    'te_contents.byName'( collection_name, document_name ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.byName expects collection_name be a non-empty string' );
        assert( document_name && _.isString( document_name ) && document_name.length, 'te_contents.byName expects document_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.byName() call with collection='+collection_name, 'document='+document_name );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = collection.findOneAsync({ name: document_name });
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.byName() returns with', res );
        }
        return res;
    },

    // import an element (so do not modify any data) 
    // returns a Promise
    'te_contents.import'( collection_name, elt ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.import expects collection_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.import() call with elt=', elt );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        const res = collection.insertAsync( elt );
        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.import() returns with', res );
        }
        return res;
    },

    // set some content into the database
    // name is mandatory
    // returns a Promise which resolves to the result of the upsert
    'te_contents.set'( collection_name, document_name, content ){
        assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.byName expects collection_name be a non-empty string' );
        assert( document_name && _.isString( document_name ) && document_name.length, 'te_contents.byName expects document_name be a non-empty string' );

        if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
            console.debug( 'pwix:editor te_contents.set() call with collection='+collection_name, 'document='+document_name, 'content=', content );
        }
        const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
        return collection.findOneAsync({ name: document_name })
            .then(( o ) => {
                o = o || {};
                if( o._id ){
                    //console.debug( 'content.set setting updatedAt' );
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
                    //console.debug( 'content.set setting createdAt' );
                    o.createdAt = new Date();
                    o.createdBy = this.userId;
                }
                o.content = content;
                //console.debug( 'orig', orig );
                //console.debug( 'o', o );
                return collection.upsertAsync({ name: document_name }, { $set: o });
            })
            .then(( res ) => {
                return res.numberAffected > 0 ? collection.findOneAsync({ name: document_name }) : res;
            })
            .then(( res ) => {
                if( Editor._conf.verbosity & Editor.C.Verbose.COLLECTIONS ){
                    console.debug( 'pwix:editor te_contents.set() returns with', res );
                }
            });
    },

    // instanciates Tabular.Table for tabular display
    // note that we must not return the instance itself as it would lead to a circular references which makes Meteor crashes when trying to ijsonable it
    // (more we do not care of the server instance when called from by the client, just want know that is is defined)
    async 'te_contents.tabular'( collection_name ){
        const tabular = await Editor.collections.Contents.getTabular( collection_name );
        return Boolean( tabular );
    }
});

/*
 * pwix:editor/src/collections/contents/server/publish.js
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { Contents } from '../contents.js';

// returns the list of known contents

Meteor.publish( 'te_contents.listAll', function( collection_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.listAll expects collection_name a non-empty string, found', collection_name );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    return collection.find();
});

Meteor.publish( 'te_contents.getByName', function( collection_name, document_name ){
    assert( collection_name && _.isString( collection_name ) && collection_name.length, 'te_contents.getByName expects collection_name be a non-empty string, found', collection_name );
    assert( document_name && _.isString( document_name ) && document_name.length, 'te_contents.getByName expects document_name be a non-empty string, found', document_name );
    const collection = Editor.collections.get( collection_name, Editor.collections.Contents.schema );
    return collection.find({ name: document_name });
});

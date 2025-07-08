/*
 * pwix:editor/src/common/collections/contents/contents.js
 *
 * The actual collection name is configurable.
 * Because the actual collection name is only known at runtime, we cannot define here the Mongo collection,
 *  but have to define both client and server-side collections at each use.
 * 
 * See Contents.methods and common/js/collections.js
 */

import 'meteor/aldeed:collection2/dynamic';

Collection2.load();

import './collection.js';
import './fieldset.js';
import './schema.js';
import './tabular.js';

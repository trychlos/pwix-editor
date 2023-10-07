/*
 * /src/client/components/teSerializer/teSerializer.js
 *
 * Get the named content from the database and let it be displayed/edited.
 * 
 * Parms:
 *  - document: mandatory, the document name in the database
 *  - collection: the collection name to get the document content from and to write to, defaulting to 'te_contents'
 *  - mode: the edition mode, defaulting to STANDARD
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict; // up to nodejs v16.x

import { ReactiveVar } from 'meteor/reactive-var';

import './teSerializer.html';

Template.teSerializer.onCreated( function(){
    const self = this;

    self.TE = {
        // component parameters
        collection: null,
        handle: null,
        document: null,
        initialized: false,

        // runtime data
        docObject: null,
        lastSavedContent: null,
        docContent: new ReactiveVar( null ),
        exists: false,
    };

    // Template.currentData() is a reactive data source
    //  so subscribe to the ad-hoc publication each time collection name or document name change
    self.autorun(() => {
        //console.debug( 'teSerializer data', Template.currentData());
        self.TE.collection = Template.currentData().collection || 'te_contents';
        assert( self.TE.collection && _.isString( self.TE.collection ) && self.TE.collection.length > 0, 'teSerializer expects a collection name, found', self.TE.collection );
        self.TE.document = Template.currentData().document;
        assert( self.TE.document && _.isString( self.TE.document ) && self.TE.document.length > 0, 'teSerializer expects a document name, found', self.TE.document );
        // be verbose
        if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS ){
            console.debug( 'pwix:editor teSerializer onCreated() collection='+self.TE.collection, 'document='+self.TE.document );
        }
        // subscribe to a publication to get this document
        console.debug( 'subscribe to te_contents.getByName with', self.TE.collection+'+'+self.TE.document );
        self.TE.handle = self.subscribe( 'te_contents.getByName', self.TE.collection, self.TE.document );
        self.TE.initialized = false;
    });
});

Template.teSerializer.onRendered( function(){
    const self = this;

    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS ){
        console.debug( 'pwix:editor teSerializer onRendered()' );
    }

    // get the editable content from the database
    // each time we modify a document, the publication is refreshed - only initialize it the first time
    self.autorun(() => {
        if( self.TE.handle.ready() && !self.TE.initialized ){
            const collection = Editor.collections.get( self.TE.collection, Editor.collections.Contents.schema );
            const doc = collection.findOne({ name: self.TE.document });
            if( doc ){
                self.TE.docObject = doc;
                self.TE.lastSavedContent = doc.content;
                self.TE.docContent.set( doc.content );
            } else {
                self.TE.docObject = { name: self.TE.document, content: '' };
                self.TE.lastSavedContent = '';
                self.TE.docContent.set( '' );
            }
            self.$( '.teScriber' ).trigger( 'te-content-reset' );
            self.TE.initialized = true;
        }
    });
});

Template.teSerializer.helpers({
    // provide parms to teScriber
    editParms(){
        const TE = Template.instance().TE;
        let o = Template.currentData();
        o.mode = o.mode || Editor.C.Mode.STANDARD;
        if( Editor._conf.verbosity & Editor.C.Verbose.MODE ){
            console.debug( 'pwix:editor teSerializer editParms asks for', o.mode );
        }
        o.content = TE.docContent;
        return o;
    }
});

Template.teSerializer.events({
    // autosave on each change
    'te-content-changed .teSerializer'( event, instance, data ){
        if( data.html !== instance.TE.lastSavedContent ){
            const collection = instance.TE.collection;
            const document = instance.TE.document;
            if( document ){
                Meteor.call( 'te_contents.set', collection, document, data.html, ( err, res ) => {
                    if( err ){
                        console.error( err );
                    } else {
                        instance.TE.lastSavedContent = data.html;
                        instance.$( '.teSerializer' ).trigger( 'te-serialized', { result: res });
                    }
                });
            } else {
                console.warn( 'teSerializer should have a document name here' );
            }
        }
    },

    // verbose
    'te-serialized .teSerializer'( event, instance, data ){
        if( Editor._conf.verbosity & Editor.C.Verbose.TEMSG ){
            console.debug( 'pwix:editor teSerializer te-serialized', data );
        }
    }
});

Template.teSerializer.onDestroyed( function(){
    // be verbose
    if( Editor._conf.verbosity & Editor.C.Verbose.COMPONENTS ){
        console.debug( 'pwix:editor teSerializer onDestroyed()' );
    }
});

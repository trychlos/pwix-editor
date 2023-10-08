/*
 * /src/client/components/teManager/teManager.js
 *
 * Provide a panel to manage the database contents.
 * This panel is to be integrated into a page of the caller site.
 * 
 * Parms:
 *  - collection: the collection name which stores the documents, defaulting to 'te_contents',
 *  - plusButton: whether we have a plus button, defaulting to true
 */

import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tolert } from 'meteor/pwix:tolert';

import '../../interfaces/igrid/igrid.js';

import './teManager.html';
import './teManager.less';

Template.teManager.onCreated( function(){
    const self = this;

    self.TE = {
        collection: null,
        handle: null,
        count: new ReactiveVar( 0 ),

        // count the checked items
        checked(){
            const checkedBtns = self.$( '.js-checkit:checked' );
            //console.debug( checkedBtns );
            self.$( 'button.js-export' ).prop( 'disabled', !window.showSaveFilePicker || checkedBtns.length === 0 );
        },

        // table sort
        cmpString( a, b ){
            return a.localeCompare( b );
        },
        compareCount( tra, trb ){
            const idx = $( 'table.js-igrid th[data-column-name="count"]' ).data( 'itfx-igrid-idx' );
            const ca = Number( $( tra ).find( 'td' )[idx].innerText );
            const cb = Number( $( trb ).find( 'td' )[idx].innerText );
            return ca < cb ? -1 : ( ca > cb ? 1 : 0 );
        },
        compareDate( tra, trb ){
            const idx = $( 'table.js-igrid th[data-column-name="date"]' ).data( 'itfx-igrid-idx' );
            const da = self.$( self.$( tra ).find( 'td' )[idx] ).find( 'p' ).data( 'app-date' );
            const db = self.$( self.$( trb ).find( 'td' )[idx] ).find( 'p' ).data( 'app-date' );
            return self.Accord.cmpString( da, db );
        },
    };

    // subscribe to the publication
    self.autorun(() => {
        self.TE.collection = Template.currentData().collection || 'te_contents';
        self.TE.handle = self.subscribe( 'teContent.listAll', self.TE.collection );
    });

    // count the published documents
    self.autorun(() => {
        if( self.TE.handle.ready()){
            const collection = Editor.collections.get( self.TE.collection );
            self.TE.count.set( collection.find().count());
        }
    });
});

Template.teManager.onRendered( function(){
    const self = this;

    self.$( 'table.js-igrid' ).IGrid({
        sort: {
            compare: [
                {
                    column: 'count',
                    compare: self.TE.compareCount
                },
                {
                    column: 'date',
                    compare: self.TE.compareDate
                }
            ]
        }
    });

    // enable the Import button when the used method exists
    self.autorun(() => {
        if( window.showOpenFilePicker ){
            self.$( 'button.js-import' ).removeAttr( 'disabled' );
        }
    });

    // enable the checkall button when we have at least one document
    self.autorun(() => {
        if( self.TE.count.get() > 0 ){
            self.$( 'thead input.js-checkall' ).removeAttr( 'disabled' );
        }
    });
});

Template.teManager.helpers({
    // count of the published contents
    contentsCount(){
        const TE = Template.instance().TE;
        return pwixI18n.label( I18N, 'manager.count_label', TE.count.get());
    },

    // list of the published contents
    contentsList(){
        const TE = Template.instance().TE;
        const collection = Editor.collections.get( TE.collection );
        return TE.handle.ready() ? collection.find({}, { sort: { name: 1 }}) : [];
    },

    // delete button title
    deleteTitle( it ){
        return pwixI18n.label( I18N, 'manager.delete_label', it.name );
    },

    // edit button title
    editTitle( it ){
        return pwixI18n.label( I18N, 'manager.edit_label', it.name );
    },

    // whether we have a plus button
    havePlusButton(){
        return ( this.plusButton === true || this.plusButton === false ) ? this.plusButton : true;
    },

    // string translation
    i18n( arg ){
        return pwixI18n.label( I18N, arg.hash.key );
    },

    // miButton parameters
    parmsModalInfo( it ){
        return {
            name: it.name || '',
            object: it
        }
    },

    // parms to plusButton
    parmsPlusButton(){
        return {
        };
    }
});

Template.teManager.events({
    // toggle all documents
    'click .js-checkall'( event, instance ){
        const checked = instance.$( event.currentTarget ).is( ':checked' );
        instance.$( '.js-checkit' ).prop( 'checked', checked );
        instance.TE.checked();
    },

    // toggle a document
    'click .js-checkit'( event, instance ){
        const checked = instance.$( event.currentTarget ).is( ':checked' );
        instance.TE.checked();
    },

    // export selected documents
    //  note that the subscription is obviously ready as we have made sure that we have at least one checked document to export
    //  uncheck all at end
    'click .js-export'( event, instance ){
        const now = new Date();
        const nows = now.toISOString().substring( 0, 10 ).replaceAll( '-', '' );
        let docs = [];
        window.showSaveFilePicker({
            suggestedName: instance.TE.collection+'-'+nows+'.json'
        }).then(( fsHandle ) => {
            return fsHandle.createWritable()
        }).then(( writable ) => {
            const collection = Editor.collections.get( instance.TE.collection );
            instance.$( '.js-checkit:checked' ).each( function(){
                const id = $( this ).closest( 'tr' ).data( 'row-id' );
                docs.push( collection.findOne({ _id: id }));
                return true;
            });
            writable.write( JSON.stringify( docs ));
            return writable;
        }).then(( writable ) => {
            writable.close();
        }).then(() => {
            Tolert.success( pwixI18n.label( I18N, 'manager.export_success', docs.length ));
            instance.$( '.js-checkall' ).prop( 'checked', false );
            instance.$( '.js-checkit' ).prop( 'checked', false );
            instance.TE.checked();
        });
    }
});

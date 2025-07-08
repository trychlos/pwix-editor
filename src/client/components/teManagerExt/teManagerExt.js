/*
 * pwix:editor/src/client/components/teManagerExt/teManagerExt.js
 *
 * A tabular display of the collection content.
 * 
 * Using meteor:tabular (encapsulated into pwix:tabular) requires to instanciates the Tabular.table class both on client and server sides.
 * Has a method for that.
 *
 * Parms:
 * - see README
 */

import { Editor } from 'meteor/pwix:editor';
import { Modal } from 'meteor/pwix:modal';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { default as alTabular } from 'meteor/aldeed:tabular';
import { Tolert } from 'meteor/pwix:tolert';

import './teManagerExt.html';

Template.teManagerExt.onCreated( function(){
    const self = this;

    self.TE = {
        tabular: new ReactiveVar( null )
    };

    self.autorun(() => {
        self.tabular?.ready.set( false );
    });

    // the collection name must be provided in the data context
    self.autorun(() => {
        const tabular = self.TE.tabular.get();
        if( !tabular ){
            const collection = Template.currentData().collection || 'te_contents';
            // make sure Tabular.Table is instanciated on the server
            Meteor.callAsync( 'te_contents.tabular', collection )
                .then(( tabular_server ) => {
                    // if ok, then same on the client
                    if( tabular_server ){
                        return Editor.collections.Contents.getTabular( collection )
                    }
                })
                .then(( tabular_client ) => {
                    self.TE.tabular.set( tabular_client );
                    self.tabular?.ready.set( true );

                });
        }
    });
});

Template.teManagerExt.helpers({
    // whether the tabular table has been instanciated
    haveTabular(){
        return Boolean( Template.instance().TE.tabular.get());
    },

    // the tabular table
    tabularTable(){
        return Template.instance().TE.tabular.get();
    }
});

Template.teManagerExt.events({
    // edit a document
    //  the buttons from tabular provide the entity document
    'tabular-edit-event .teManagerExt'( event, instance, { item, table }){
        //console.debug( 'item', item );
        //console.debug( 'table', table );
        Modal.run({
            ...this,
            mdBody: 'teSerializer',
            mdButtons: [ Modal.C.Button.CLOSE ],
            mdClasses: this.mdClasses || 'modal-xl',
            mdTitle: pwixI18n.label( I18N, 'list.edit.title', item.name ),
            collection: table.name,
            document: item.name,
            mode: Editor.C.Mode.EDITION
        });
        return false;
    }
});

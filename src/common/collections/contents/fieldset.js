/*
 * pwix:editor/src/common/collections/contents/fieldset.js
 *
 * Define here the fields to be published and/or rendered in the tabular display.
 * Install this fieldset as a ReactiveVar into Editor.collections.Contents.
 */

import ellipsize from 'ellipsize';
import strftime from 'strftime';

import { Field } from 'meteor/pwix:field';
import { pwixI18n } from 'meteor/pwix:i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Timestampable } from 'meteor/pwix:collection-timestampable';
import { Tracker } from 'meteor/tracker';

// install the fieldset as a ReactiveVar into Editor.collections.Contents
Editor.collections.Contents.fieldSet = new ReactiveVar( null );

const _defaultFieldSet = function( conf ){
    let columns = [
        // a mandatory label, identifies the document
        {
            name: 'name',
            type: 'String',
            dt_title: pwixI18n.label( I18N, 'list.headers.name_th' )
        },
        // the (ellipsized) document content
        {
            name: 'content',
            type: 'String',
            dt_title: pwixI18n.label( I18N, 'list.headers.content_th' ),
            dt_render( data, type, rowData, meta ){
                if( type === 'display' ){
                    return ellipsize( data, 250 );
                }
                return data;
            }
        },
        Timestampable.fieldDef(),
        {
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.headers.length_th' ),
            dt_render( data, type, rowData ){
                return rowData.content?.length || 0;
            }
        },
        {
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.headers.updatedat_th' ),
            dt_render( data, type, rowData ){
                return strftime( '%Y-%m-%d %H:%M:%S', rowData.updatedAt || rowData.createdAt );
            }
        },
        {
            schema: false,
            dt_title: pwixI18n.label( I18N, 'list.headers.updatedby_th' ),
            dt_template: Meteor.isClient && Template.ahPreferredLabel,
            dt_templateContext( rowData ){
                return {
                    ahName: 'users',
                    ahUserId: rowData.updatedBy || rowData.createdBy
                };
            }
        }
    ];
    return columns;
};

Tracker.autorun(() => {
    const conf = Editor.configure();
    let columns = _defaultFieldSet( conf );
    let fieldset = new Field.Set( columns );
    Editor.collections.Contents.fieldSet.set( fieldset );
});

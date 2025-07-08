/*
 * pwix:editor/src/common/collections/contents/tabular.js
 */

import _ from 'lodash';

import { pwixI18n } from 'meteor/pwix:i18n';
import { Tabular } from 'meteor/pwix:tabular';

Editor.collections.Contents.tabulars = {};

/**
 * @locus Anywhere
 * @summary a function which returns a Tabular.Table instance for the named collection
 * @param {String} name
 * @returns {Tabular.Table}
 */
Editor.collections.Contents.getTabular = async function( name ){
    let tabular = Editor.collections.Contents.tabulars[name];
    if( !tabular ){
        const fieldSet = Editor.collections.Contents.fieldSet.get();
        const collection = Editor.collections.get( name, Editor.collections.Contents.schema );
        const columns = fieldSet.toTabular();
        if( fieldSet && collection && columns ){
            //console.debug( 'instanciating Tabular.Table', name );
            tabular = new Tabular.Table({
                name: name,
                collection: collection,
                columns: columns,
                //pub: 'pwix_app_pages_edit_contents_tabular',
                tabular: {
                    async editButtonTitle( it ){
                        return pwixI18n.label( I18N, 'list.buttons.edit_title', it.name );
                    },
                    async editItem( it ){
                        return it;
                    },
                    async infoButtonTitle( it ){
                        return pwixI18n.label( I18N, 'list.buttons.info_title', it.name );
                    },
                    async infoItem( it ){
                        return it;
                    },
                    async infoModalTitle( it ){
                        return pwixI18n.label( I18N, 'list.buttons.info_modal', it.name );
                    },
                    withDeleteButton: false
                },
                destroy: true,
                order: [[ 0, 'asc' ]]
            });
            Editor.collections.Contents.tabulars[name] = tabular;
        }
    }
    return tabular;
};

/*
 * pwix:editor/src/common/js/i18n.js
 */

Editor.i18n = {
    en: {
        cookies: {
            illimited: 'Illimited',
            switch_state: 'Record last state of the edit toggle switch'
        },
        list: {
            buttons: {
                edit_title: 'Edit the "%s" document',
                info_modal: 'Informations about the "%s" document',
                info_title: 'Informations about the "%s" document'
            },
            headers: {
                content_th: 'Content',
                length_th: 'Length',
                name_th: 'Name',
                updatedat_th: 'Last updated at',
                updatedby_th: 'Last updated by'
            }
        },
        manager: {
            count_label: '%s registered document(s)',
            delete_label: 'Delete "%s"',
            edit_label: 'Edit "%s"',
            export_btn: 'Export to...',
            export_success: '%s documents successfully exported',
            import_btn: 'Import from...',
            length_header: 'Size',
            name_header: 'Name'
        },
        unnamed: '<unnamed>'
    },
    fr: {
        cookies: {
            illimited: 'Illimitée',
            switch_state: 'Enregistre l\'état du bouton d\'édition'
        },
        list: {
            buttons: {
                edit_title: 'Edit le document "%s"',
                info_modal: 'Informations sur le document "%s"',
                info_title: 'Informations sur le document "%s"'
            },
            headers: {
                content_th: 'Contenu',
                length_th: 'Taille',
                name_th: 'Nom',
                updatedat_th: 'Dernière mise à jour le',
                updatedby_th: 'Dernière mise à jour par'
            }
        },
        manager: {
            count_label: '%s document(s) enregistré(s)',
            delete_label: 'Supprimer "%s"',
            edit_label: 'Editer "%s"',
            export_btn: 'Exporter vers...',
            export_success: '%s documents exportés avec succès',
            import_btn: 'Importer de...',
            length_header: 'Taille',
            name_header: 'Nom'
        },
        unnamed: '<non nommé>'
    }
};

pwixI18n.namespace( I18N, Editor.i18n );

/**
 * @locus Anywhere
 * @returns {String} the i18n namespace of this package
 */
Editor.i18n.namespace = function(){
    return I18N;
};

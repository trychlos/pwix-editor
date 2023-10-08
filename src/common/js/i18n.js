/*
 * pwix:editor/src/common/js/i18n.js
 */

Editor.i18n = {
    en: {
        cookies: {
            illimited: 'Illimited',
            switch_state: 'Record last state of the edit toggle switch'
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

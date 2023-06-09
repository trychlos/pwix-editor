/*
 * pwix:editor/src/common/js/i18n.js
 */

teEditor.i18n = {
    en: {
        cookies: {
            illimited: 'Illimited',
            switch_state: 'Record last state of the edit toggle switch'
        },
        unnamed: '<unnamed>'
    },
    fr: {
        cookies: {
            illimited: 'Illimitée',
            switch_state: 'Enregistre l\'état du bouton d\'édition'
        },
        unnamed: '<non nommé>'
    }
};

pwixI18n.namespace( I18N, teEditor.i18n );

/**
 * @locus Anywhere
 * @returns {String} the i18n namespace of this package
 */
teEditor.i18n.namespace = function(){
    return I18N;
};

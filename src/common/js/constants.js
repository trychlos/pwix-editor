/*
 * pwix:editor/src/common/js/constants.js
 */

Editor.C = {
    // display mode
    Mode: {
        HIDDEN:   'MODE_HIDDEN',
        STANDARD: 'MODE_STANDARD',
        PREVIEW:  'MODE_PREVIEW',
        EDITION:  'MODE_EDITION'
    },
    // verbosity levels
    Verbose: {
        NONE:        0,
        MODE:        0x01 <<  0,
        TEMSG:       0x01 <<  1,
        TRUMBOWYG:   0x01 <<  2,
        UPLOAD:      0x01 <<  3,
        CONFIGURE:   0x01 <<  4,
        COLLECTIONS: 0x01 <<  5,
        COMPONENTS:  0x01 <<  6,
        SWITCH:      0x01 <<  7
    }
};

Editor.Modes = [];
Object.keys( Editor.C.Mode ).every(( k ) => {
    Editor.Modes.push( Editor.C.Mode[k] );
    return true;
});

// internal (non exported) constants

// the cookie name for the switch state, defined here to be available anywhere
COOKIE_RESPONSIBLE = 'pwix:Editor';
COOKIE_SWITCH_STATE = 'switch_state';
COOKIE_SWITCH_STATE_IDENTIFIER = COOKIE_RESPONSIBLE + '/' + COOKIE_SWITCH_STATE + '/';

I18N = 'pwix:editor:i18n';

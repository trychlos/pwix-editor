/*
 * pwix:editor/src/common/js/constants.js
 */

// internal constants
//

// the cookie name for the switch state, defined here to be available anywhere
COOKIE_SWITCH_STATE = 'pwix:Editor/switch_state';

// exported constants
//

TE_MODE_HIDDEN = 'TE_MODE_HIDDEN';
TE_MODE_STANDARD = 'TE_MODE_STANDARD';
TE_MODE_PREVIEW = 'TE_MODE_PREVIEW';
TE_MODE_EDITION = 'TE_MODE_EDITION';

Editor.Modes = [
    TE_MODE_HIDDEN,
    TE_MODE_STANDARD,
    TE_MODE_PREVIEW,
    TE_MODE_EDITION
];

TE_VERBOSE_NONE        = 0;
TE_VERBOSE_MODE        = 0x01 <<  0;
TE_VERBOSE_TEMSG       = 0x01 <<  1;
TE_VERBOSE_TRUMBOWYG   = 0x01 <<  2;
TE_VERBOSE_UPLOAD      = 0x01 <<  3;
TE_VERBOSE_CONFIGURE   = 0x01 <<  4;
TE_VERBOSE_COLLECTIONS = 0x01 <<  5;
TE_VERBOSE_COMPONENTS  = 0x01 <<  6;
TE_VERBOSE_SWITCH      = 0x01 <<  7;

// non exported

I18N = 'pwix:editor:i18n';

/*
 * pwix:editor/src/common/js/constants.js
 */

TE_MODE_HIDDEN = 'TE_MODE_HIDDEN';
TE_MODE_STANDARD = 'TE_MODE_STANDARD';
TE_MODE_PREVIEW = 'TE_MODE_PREVIEW';
TE_MODE_EDITION = 'TE_MODE_EDITION';

pwiEditor.Modes = [
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
TE_VERBOSE_WARN_CREATE = 0x01 <<  6;
TE_VERBOSE_WARN_DELETE = 0x01 <<  7;
TE_VERBOSE_WARN_READ   = 0x01 <<  8;
TE_VERBOSE_WARN_UPDATE = 0x01 <<  9;
TE_VERBOSE_COMPONENTS  = 0x01 << 10;

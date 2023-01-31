/*
 * pwix:editor/src/common/js/defaults.js
 */

defaults = {
    common: {
        uploadUrl: '',
        verbosity: TE_VERBOSE_NONE
    }
};

pwiEditor.conf = {
    ...pwiEditor.conf,
    ...defaults.common
};

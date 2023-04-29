/*
 * pwix:editor/src/common/js/defaults.js
 */

import merge from 'merge';

teEditor._defaults = {
    collections: {
        prefix: 'te_'
    },
    storeSwitchState: false,
    uploadUrl: '',
    verbosity: TE_VERBOSE_NONE
};

teEditor.conf = merge.recursive( true, teEditor.conf, teEditor._defaults );

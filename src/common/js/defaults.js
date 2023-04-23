/*
 * pwix:editor/src/common/js/defaults.js
 */

import merge from 'merge';

defaults = {
    conf: {
        collections: {
            prefix: 'te_'
        },
        uploadUrl: '',
        verbosity: TE_VERBOSE_NONE
    }
};

teEditor.conf = merge.recursive( true, teEditor.conf, defaults.conf );

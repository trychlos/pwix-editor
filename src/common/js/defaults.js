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

pwiEditor.conf = merge.recursive( true, pwiEditor.conf, defaults.conf );

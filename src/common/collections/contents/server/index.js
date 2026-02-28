/*
 * pwix:editor/src/common/collections/contents/server/index.js
 */

import { Logger } from 'meteor/pwix:logger';

import './methods.js';
import './publish.js';

const logger = Logger.get();

logger.verbose({ verbosity: Editor.configure().verbosity, against: Editor.C.Verbose.COLLECTIONS }, 'declaring Contents collection' );

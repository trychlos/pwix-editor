# pwix:editor

## ChangeLog

### 1.5.0-rc

    Release date: 

    - Extend uuid dependency to v11.0.0, thus bumping minor candidate version number
    - Define new teManagerExt component to provide a tabular (datatables-based) display

### 1.4.5

    Release date: 2024-10- 4

    - Add missing pwix:modal-info dependency

### 1.4.4

    Release date: 2024- 9-20

    - Accept uuid v10

### 1.4.3

    Release date: 2024- 6- 9

    - Update pwix:plus-button dependency
    - Use pwix:ui-bootstrap5 to provide missing bootstrap dependency

### 1.4.2

    Release date: 2024- 5-25

    - Replace the sync calls by their Async version (todo #13)

### 1.4.1

    Release date: 2024- 5-24

    - Meteor 3.0 ready

### 1.4.0

    Release date: 2023-10-11

    - Replace all fonts by a converted (and hopefully sanitized) version from https://transfonter.org
    - teSerializer now provides a default collection name
    - Change the document parameter in teSerializer from name to document (bumping candidate version number)
    - Change the default edition mode in teSerializer from PREVIEW to STANDARD
    - Publish the accessed document rather that using a method to take advantage of Meteor reactivity
    - Uses dburles:mongo-collection-instances package to not try to redeclare existing Mongo collections
    - Prevent a form to be submitted when hitting Enter during edition
    - Make sure we have a createdAt/createdBy data after schema modification
    - Provide a full publication of the contents collection
    - Provide a workaround for Meteor bug #12524 when font files are to be loaded
 
### 1.3.0

    Release date: 2023- 9-17

    - Add jquery-resizable NPM dependency required by trumbowyg:resizeimg plugin
    - Now embed a patched version of trumbowyg 2.27.3 (due to https://github.com/Alex-D/Trumbowyg/issues/1396 issue)
    - Define fontfamilyAdds as a new teScriber parameter (bumping candidate version number)
    - Replace default fonts list by our own, providing fonts in the same time
    - Define 'Increase font size' and 'Decrease font size' buttons

### 1.2.1

    Release date: 2023- 9-12

    - Add pwix:toggle-switch dependency
    - Bump pwix:i18n version requirement
    - Fix CookieManager publication at startup
    - Restore initial constant values
    - Back to Meteor 2.9.0

### 1.2.0

    Release date: 2023- 9-10

    - Remove (unused at the moment) jquery-resizable-dom dependency
    - Rename teEditor as Editor (bumping candidate version number)
    - Replace exported constants with Editor.C structure
    - Bump Meteor version requirement to 2.13.2
    - Adapt to CookieManager v 1.3.0 and confirm the role of configuration parm (todo #2)

### 1.1.1

    Release date: 2023- 7- 1

    - Fix configure() actually acts as a getter
    - Introduce global.js to define the global object

### 1.1.0

    Release date: 2023- 6-20

    - Define Editor.i18n.namespace() to let another package add a translation to this one (todo #5)
    - Replace merge dependency with lodash
    - Rename the conf object to _conf, making clearer it is private
    - configure() now acts explicitely both as a getter and a setter

### 1.0.1

    Release date: 2023- 5- 1

    - Fix Meteor packaging

### 1.0.0

    Release date: 2023- 5- 1

    - Initial release

---
P. Wieser
- Last updated on 2024, Oct. 4th

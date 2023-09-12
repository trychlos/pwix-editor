# pwix:editor

## ChangeLog

### 1.2.1-rc

    Release date: 

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
- Last updated on 2023, Sept. 10th

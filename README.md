# pwix:editor

This is an encapsulation of 'trumbowyg' Javascript editor for Meteor, so a client-only package.

## A bit of taxonomy

### Documents

`pwix:editor` talks a lot of _documents_ though, actually, `pwix:editor` doesn't know anything about them.
But it expects that these unknown and unmanaged _documents_ have two main properties:

- a HTML content, said _document's content_ here
- an optional name which identifies the document, said _document's name_ here.

### Edition mode

`pwix:editor` is able to manage four edition modes:

- `Editor.C.Mode.HIDDEN`

    Build the component, but do not display in the DOM.

- `Editor.C.Mode.STANDARD`

    The document's content is displayed as standard HTML: this is the default startup mode.<br />
    In this mode, all the document's content is just displayed as if they were no editor at all.
    This way, you can safely directly integrates `teScriber` component in your pages without your standard user being conscious of anything.

- `Editor.C.Mode.PREVIEW`

    The document's content is displayed inside of a thin panel.<br />
    The header of this panel displays the document's name, along with two `Preview` and `Edit` buttons.
    The document's content is displayed as standard HTML.

- `Editor.C.Mode.EDITION`

    This mode is an extension of the `Editor.C.Mode.PREVIEW`, where the user is able to actually edit the document's content.
    A buttons panel with different edition options (font size, color, etc.) along with a WYSIWYG HTML editor is available.

## Configuration

The package's behavior can be configured through a call to the `Editor.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `fontfamilyAdds`

    A list of font families to be added to the default `teEditor` ones.

    This is supposed to be an array of objects with following keys:

    - `name`: the displayed name
    - `family`: the font face family.

- `storeSwitchState`

    Whether the application plans to use the `teSwitch` component and wishes to record its last state.

    When enabled, this option will create a _cookie_.
    
    This _cookie_ is published to CookieManager as a functional one, and the user may refuse it.

    Default to `false`.

- `uploadUrl`

    The URL to which the images should be uploaded.<br />
    No default.

- `verbosity`

    Define the expected verbosity level.

    The accepted value can be any or-ed combination of following:

    - `Editor.C.Verbose.NONE`

        Do not display any trace log to the console

    - `Editor.C.Verbose.COLLECTIONS`

        Trace collections events.

        This includes on each and every collection:

        - declarations and definitions
        - methods calls and results 

    - `Editor.C.Verbose.COMPONENTS`

        Trace Blaze components life:

        - creation
        - rendering
        - destruction

    - `Editor.C.Verbose.CONFIGURE`

        Trace `Editor.configure()` calls and their result

    - `Editor.C.Verbose.MODE`

        Trace edition mode changes

    - `Editor.C.Verbose.SWITCH`

        Trace the internal behavior of the `teSwitch` component

    - `Editor.C.Verbose.TEMSG`

        Trace `te-xxx` messages

    - `Editor.C.Verbose.TRUMBOWYG`

        Trace the 'trumbowyg' editor life:

        - instanciation and deletion
        - internal messaging events

    - `Editor.C.Verbose.UPLOAD`

        Trace upload configuration and operations

Please note that `Editor.configure()` methmethod should be called in the same terms both in client and server sides.

Also note, as an explicit reminder for the fools, that, because the Meteor packages are instanciated at application level, they can be configured once at most, and only once at most. Each addtionnal call to `Editor.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## Provides

### A global object

`Editor`

This object is allocated at package level: there is only one instance in your application. It gathers the avilable methods (see below).

This global object contains:

- `Editor.Modes`

    An array of allowed edition modes.

### Methods

### Constants

#### Edition modes

- `Editor.C.Mode.HIDDEN`
- `Editor.C.Mode.STANDARD`
- `Editor.C.Mode.PREVIEW`
- `Editor.C.Mode.EDITION`

#### Verbosity levels

- `Editor.C.Verbose.NONE`
- `Editor.C.Verbose.COLLECTIONS`
- `Editor.C.Verbose.COMPONENTS`
- `Editor.C.Verbose.CONFIGURE`
- `Editor.C.Verbose.MODE`
- `Editor.C.Verbose.SWITCH`
- `Editor.C.Verbose.TEMSG`
- `Editor.C.Verbose.TRUMBOWYG`
- `Editor.C.Verbose.UPLOAD`

### Blaze components

#### `teManager`

A panel which let the application manage its documents.

The component is configurable with an object passed as an argument, which may contain:

- `collection`

    The collection name, defaulting to `te_contents`.

- `plusButton`

    Whether the manager should exhibit a 'plus' button, defaulting to `true`.

#### `teScriber`

The editor component itself.

The component is configurable with an object passed as an argument, which may contain:

- `content`

    An optional input/output ReactiveVar which is expected to contain the ... document's content (by the way), interpreted as a HTML string.

    It not provided, the component just displays an empty editing area, and advertises of its updates through the `te-content-changed` event.

- `mode`

    The edition mode as a string, defaulting to `Editor.C.Mode.STANDARD`.

- `document`

    The document's name as a string, defaulting to the empty string.

- `displayName`

    Whether to display the name in the topmost panel, defaulting to `true`.

- `withNamePanel`

    Whether to display the topmost panel, which would include the document's name and the preview/edit buttons, defaulting to `true`.

- `withHTMLBtn`

    Whether to authorize the HTML button, which should be reserved to advanced users, defaulting to `true`.

- `withFullScreenBtn`

    Whether to authorize the FullScreen button, which should be reserved to edit full articles, defaulting to `true`.

- `fontfamilyAdds`

    An array of font families to be added to those already managed by the editor.

    Example:
    ```
        [
            { name: 'Arial', family: 'Arial, Helvetica, sans-serif' }
        ]
    ```

The `teScriber` component doesn't provide any save way. Instead, it provides two ways for the caller be informed of the changes:

- the `content` ReactiveVar, if provided, is continuously updated,

- a `te-content-changed` message is sent on the component on each change.

#### `teSerializer`

This is an encapsulation of the Editor component, which manages the serialization/deserialization of the documents.

The component is configurable with an object passed as an argument, which may contain:

- `collection`

    The collection name, defaulting to `te_contents`.

    `teSerializer` expects that the collection supports `name`, `content`, `createdAt`, `createdBy`, `updatedAt` and `updatedBy` standard fields.

    The `Editor.collections.Contents.schema` schema can be used as a to-be-extended base schema by the application.

- `document`

    The document name in the database.

    Mandatory.

- `mode`

    The desired edition mode, defaulting to `Editor.C.Mode.STANDARD`

Because `teSerializer` is an encapsulation of `teScriber`, then `teScriber` needed arguments can also be passed through the argument object.

#### `teSwitch`

A switch which let the user toggle the edition mode.

Use case: particularly in development mode, it happens that the `Editor.C.Mode.PREVIEW` may slightly disturb the display. This switch, when toggled to `off`, let the editor run in `Editor.C.Mode.STANDARD` even when the user is allowed to edit.

The component is configurable with an object passed as an argument, which may contain:

- `labelTop`
 
    A (HTML) string to be displayed above the switch, defaulting to none

- `labelRight`
 
    A (HTML) string to be displayed on the right of the switch, defaulting to none

- `labelBottom`
 
    A (HTML) string to be displayed below the switch, defaulting to none

- `labelLeft`
 
    A (HTML) string to be displayed on the left of the switch, defaulting to none

- `title`
 
    A string label as the button title, defaulting to none

 - `state`
 
    Whether the switch is initially `on` or `off`, defaulting to `off`

 - `enabled`
 
    Whether the switch is initially enabled, defaulting to `true`

The `teSwitch` component maintains its state through two `Editor` reaactive variables:

- `Editor.switch.used`

    Whether the application makes use of the `teSwitch` component. The variable is set to `true` when the component is created, set to `false` on destruction.

- `Editor.switch.state`

    When used, the state of the `teSwitch` component, as `true` for `on`, `false` for `off`.

### Events

#### Informational messages

Informational messages are sent by the component on itself. The caller can take advantage of them to be kept informed about the various changes.

- `te-mode-changed`

    Triggered on the `teScriber` element when the edition mode changes.

    Provides an object `{ prev: <previous_mode>, new: <new_mode> }`

- `te-content-changed`

    Triggered on the `teScriber` element when the content has been changed (in `Editor.C.Mode.EDITION` mode only).

    Provides an object `{ html: <html> }` or `{ html: <html>, name: <name> }`, depending whether a `name` has been provided or not.

- `te-initialized`

    Triggered on the `teScriber` element when the editor has been initialized (in `Editor.C.Mode.PREVIEW` or `Editor.C.Mode.EDITION` modes).

- `te-serialized`

    Triggered on the `teSerializer` element when the content has been serialized.

    Provides an object `{ result: <result> }`.

- `te-switch-on`
- `te-switch-off`

    Triggered on the `teSwitch` component when the switch state changes. The message advertises of the new state of the switch.

#### Action messages

Action messages are the way the caller can interact with the component during its lifetime. They must be sent to the `teScriber` component.

- `te-content-reset`

    Force the editor to take into account the current content of the provided ReactiveVar.

    May be useful when the caller has to cancel a done edition, and restore a previous value.

    The `te-content-changed` message is not sent when this action is requested.

- `te-mode-set`

    Change the mode to the specified one.

    Expects an object `{ mode: <mode> }`.

### Fonts

`pwix:editor` provides following fonts:

- Arial
- Arial Black
- Comic Sans
- Courier
- Cousine
- Josefin Sans
- Orbitron
- Serpentine
- Ubuntu Mono.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.4.0:
```
    'jquery-resizable-dom': '^0.35.0',
    'lodash': '^4.17.0',
    'uuid': '^9.0.0'
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-editor/pulls).

## Cookies and comparable technologies

`pwix:editor` may use `localStorage` to record some valuable data.

### `pwix:editor/switch_state`

The last `teSwitch` state.

Allowed/disallowed through the `storeSwitchState` configuration parameter.

This is considered a disableable functional _cookie_, and is advertised as such to the CookieManager if it is present.

---
P. Wieser
- Last updated on 2023, Oct. 11th

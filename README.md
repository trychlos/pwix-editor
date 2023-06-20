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

- `TE_MODE_HIDDEN`

    Build the component, but do not display in the DOM.

- `TE_MODE_STANDARD`

    The document's content is displayed as standard HTML: this is the default startup mode.<br />
    In this mode, all the document's content is just displayed as if they were no editor at all.
    This way, you can safely directly integrates `teScriber` component in your pages without your standard user being conscious of anything.

- `TE_MODE_PREVIEW`

    The document's content is displayed inside of a thin panel.<br />
    The header of this panel displays the document's name, along with two `Preview` and `Edit` buttons.
    The document's content is displayed as standard HTML.

- `TE_MODE_EDITION`

    This mode is an extension of the `TE_MODE_PREVIEW`, where the user is able to actually edit the document's content.
    A buttons panel with different edition options (font size, color, etc.) along with a WYSIWYG HTML editor is available.

## Configuration

The package's behavior can be configured through a call to the `teEditor.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `storeSwitchState`

    Whether the application plans to use the `teSwitch` component and wishes to record its last state.

    When enabled, this option will create a _cookie_, that the user may refuse.

    Default to `false`.

- `uploadUrl`

    The URL to which the images should be uploaded.<br />
    No default.

- `verbosity`

    Define the expected verbosity level.

    The accepted value can be any or-ed combination of following:

    - `TE_VERBOSE_NONE`

        Do not display any trace log to the console

    - `TE_VERBOSE_COLLECTIONS`

        Trace collections events.

        This includes on each and every collection:

        - declarations and definitions
        - methods calls and results 

    - `TE_VERBOSE_COMPONENTS`

        Trace Blaze components life:

        - creation
        - rendering
        - destruction

    - `TE_VERBOSE_CONFIGURE`

        Trace `teEditor.configure()` calls and their result

    - `TE_VERBOSE_MODE`

        Trace edition mode changes

    - `TE_VERBOSE_SWITCH`

        Trace the internal behavior of the `teSwitch` component

    - `TE_VERBOSE_TEMSG`

        Trace `te-xxx` messages

    - `TE_VERBOSE_TRUMBOWYG`

        Trace the 'trumbowyg' editor life:

        - instanciation and deletion
        - internal messaging events

    - `TE_VERBOSE_UPLOAD`

        Trace upload configuration and operations

Please note that `teEditor.configure()` methmethod should be called in the same terms both in client and server sides.

Also note, as an explicit reminder for the fools, that, because the Meteor packages are instanciated at application level, they can be configured once at most, and only once at most. Each addtionnal call to `teEditor.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## Provides

### A global object

`teEditor`

This object is allocated at package level: there is only one instance in your application. It gathers the avilable methods (see below).

This global object contains:

- `teEditor.Modes`

    An array of allowed edition modes.

### Constants

- `TE_MODE_HIDDEN`
- `TE_MODE_STANDARD`
- `TE_MODE_PREVIEW`
- `TE_MODE_EDITION`

- `TE_VERBOSE_NONE`
- `TE_VERBOSE_COLLECTIONS`
- `TE_VERBOSE_COMPONENTS`
- `TE_VERBOSE_CONFIGURE`
- `TE_VERBOSE_MODE`
- `TE_VERBOSE_SWITCH`
- `TE_VERBOSE_TEMSG`
- `TE_VERBOSE_TRUMBOWYG`
- `TE_VERBOSE_UPLOAD`

### Blaze components

#### `teSerializer`

This is an encapsulation of the teEditor component, which manages serialized documents.

The component is configurable with an object passed as an argument, which may contain:

- `name`

    The content name in the database.

    This is mandatory.

Because `teSerializer` is an encapsulation of `teScriber`, then `teScriber` needed arguments may also be passed through the argument object. Only `content` and `mode` are managed directly by the `teSerializer` component.

#### `teScriber`

The editor component itself.

The component is configurable with an object passed as an argument, which may contain:

- `content`

    An optional input/output ReactiveVar which is expected to contain the ... document's content (by the way), interpreted as a HTML string.

    It not provided, the component just displays an empty editing area.

- `mode`

    The edition mode as a string, defaulting to `TE_MODE_STANDARD`.

- `name`

    The document's name as a string, defaulting to the empty string.

- `displayName`

    Whether to display the name in the topmost panel, defaulting to `true`.

- `withNamePanel`

    Whether to display the topmost panel, which would include the document's name and the preview/edit buttons, defaulting to `true`.

- `withHTMLBtn`

    Whether to authorize the HTML button, which should be reserved to advanced users, defaulting to `true`.

- `withFullScreenBtn`

    Whether to authorize the FullScreen button, which should be reserved to edit full articles, defaulting to `true`.

The `teScriber` component doesn't provide any save way. Instead, it provides two ways for the caller be informed of the changes:
- the `content` ReactiveVar, if provided, is continuously updated,
- a `te-content-changed` message is sent on the component on each change.

#### `teSwitch`

A switch which let the user toggle the edition mode.

Use case: particularly in development mode, it happens that the `TE_MODE_PREVIEW` may slightly disturb the display. This switch let the editor run in `TE_MODE_STANDARD` even when the user is allowed to edit, while the toggle switch is off.

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

 - `initialState`
 
    Whether the switch is initially on or off, defaulting to off

The `teSwitch` component maintains its state through two `teEditor` reaactive variables:

- `teEditor.switch.used`

    Whether the application makes use of the `teSwitch` component

- `teEditor.switch.state`

    When used, the state of the `teSwitch` component

#### Informational messages

Informational messages are sent by the component on itself. The caller can take advantage of them to be kept informed about the various changes.

- `te-mode-changed`

    Triggered on the `teScriber` element when the edition mode changes.

    Provides an object `{ prev: <previous_mode>, new: <new_mode> }`

- `te-content-changed`

    Triggered on the `teScriber` element when the content has been changed (in `TE_MODE_EDITION` mode only).

    Provides an object `{ html: <html> }` or `{ html: <html>, name: <name> }`, depending whether a `name` has been provided or not.

- `te-initialized`

    Triggered on the `teScriber` element when the editor has been initialized (in `TE_MODE_PREVIEW` or `TE_MODE_EDITION` modes).

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

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`. 

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:
```
    '@popperjs/core': '^2.11.6',
    'bootstrap': '^5.2.1',
    'jquery-resizable-dom': '^0.35.0',
    'lodash': '^4.17.0',
    'trumbowyg': '^2.26.0',
    'uuid': '^9.0.0'
```

Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-editor/pulls).

## Cookies and comparable technologies

`pwix:editor` may use `localStorage` to record the last `teSwitch` state, but only if asked so through the `storeSwitchState` configuration parameter.

This is considered a disableable functional _cookie_, and is advertised as such to the cookieManager if present.

---
P. Wieser
- Last updated on 2023, May 1st

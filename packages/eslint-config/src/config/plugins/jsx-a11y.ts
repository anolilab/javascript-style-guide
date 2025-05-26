import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("jsx_and_tsx", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const jsxA11yPlugin = await interopDefault(import("eslint-plugin-jsx-a11y"));

    return [
        {
            files,
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                },
            },
            name: "anolilab/jsx-a11y/setup",
            plugins: {
                "jsx-a11y": jsxA11yPlugin,
            },
            rules: {
                // Enforce that anchors have content
                // disabled; rule is deprecated
                "jsx-a11y/accessible-emoji": "off",

                // Require ARIA roles to be valid and non-abstract
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md
                "jsx-a11y/alt-text": [
                    "error",
                    {
                        area: [],
                        elements: ["img", "object", "area", "input[type=\"image\"]"],
                        img: [],
                        "input[type=\"image\"]": [],
                        object: [],
                    },
                ],

                // Enforce all aria-* props are valid.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-has-content.md
                "jsx-a11y/anchor-has-content": ["error", { components: [] }],

                // Enforce ARIA state and property values are valid.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md
                "jsx-a11y/anchor-is-valid": [
                    "error",
                    {
                        aspects: ["noHref", "invalidHref", "preferButton"],
                        components: ["A", "LinkTo", "Link"],
                        specialLink: ["to"],
                    },
                ],

                // Enforce that elements that do not support ARIA roles, states, and
                // properties do not have those attributes.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-activedescendant-has-tabindex.md
                "jsx-a11y/aria-activedescendant-has-tabindex": "error",

                // Enforce that all elements that require alternative text have meaningful information
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-props.md
                "jsx-a11y/aria-props": "error",

                // Prevent img alt text from containing redundant words like "image", "picture", or "photo"
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-proptypes.md
                "jsx-a11y/aria-proptypes": "error",

                // require that JSX labels use "htmlFor"
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-for.md
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-role.md
                "jsx-a11y/aria-role": ["error", { ignoreNonDOM: false }],

                // Enforce that a label tag has a text label and an associated control.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-unsupported-elements.md
                "jsx-a11y/aria-unsupported-elements": "error",

                // Enforce that a control (an interactive element) has a text label.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/29c68596b15c4ff0a40daae6d4a2670e36e37d35/docs/rules/autocomplete-valid.md
                "jsx-a11y/autocomplete-valid": [
                    "off",
                    {
                        inputComponents: [],
                    },
                ],

                // require that mouseover/out come with focus/blur, for keyboard-only users
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/click-events-have-key-events.md
                "jsx-a11y/click-events-have-key-events": "error",

                // Prevent use of `accessKey`
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/control-has-associated-label.md
                "jsx-a11y/control-has-associated-label": [
                    "error",
                    {
                        controlComponents: [],
                        depth: 5,
                        ignoreElements: ["audio", "canvas", "embed", "input", "textarea", "tr", "video"],
                        ignoreRoles: ["grid", "listbox", "menu", "menubar", "radiogroup", "row", "tablist", "toolbar", "tree", "treegrid"],
                        labelAttributes: ["label"],
                    },
                ],

                // require onBlur instead of onChange
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/heading-has-content.md
                "jsx-a11y/heading-has-content": ["error", { components: [""] }],

                // Elements with an interactive role and interaction handlers must be focusable
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/html-has-lang.md
                "jsx-a11y/html-has-lang": "error",

                // Enforce that elements with ARIA roles must have all required attributes
                // for that role.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/iframe-has-title.md
                "jsx-a11y/iframe-has-title": "error",

                // Enforce that elements with explicit or implicit roles defined contain
                // only aria-* properties supported by that role.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/img-redundant-alt.md
                "jsx-a11y/img-redundant-alt": "error",

                // Enforce tabIndex value is not greater than zero.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/interactive-supports-focus.md
                "jsx-a11y/interactive-supports-focus": "error",

                // ensure <hX> tags have content and are not aria-hidden
                // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/b800f40a2a69ad48015ae9226fbe879f946757ed/docs/rules/label-has-associated-control.md
                "jsx-a11y/label-has-associated-control": [
                    "error",
                    {
                        assert: "both",
                        controlComponents: [],
                        depth: 25,
                        labelAttributes: [],
                        labelComponents: [],
                    },
                ],

                // require HTML elements to have a "lang" prop
                // deprecated: replaced by `label-has-associated-control` rule
                "jsx-a11y/label-has-for": [
                    "off",
                    {
                        allowChildren: false,
                        components: [],
                        required: {
                            every: ["nesting", "id"],
                        },
                    },
                ],

                // require HTML element's lang prop to be valid
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/lang.md
                "jsx-a11y/lang": "error",

                // prevent distracting elements, like <marquee> and <blink>
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/media-has-caption.md
                "jsx-a11y/media-has-caption": [
                    "error",
                    {
                        audio: [],
                        track: [],
                        video: [],
                    },
                ],

                // only allow <th> to have the "scope" attr
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md
                "jsx-a11y/mouse-events-have-key-events": "error",

                // require onClick be accompanied by onKeyUp/onKeyDown/onKeyPress
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-access-key.md
                "jsx-a11y/no-access-key": "error",

                // Enforce that DOM elements without semantic behavior not have interaction handlers
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-autofocus.md
                "jsx-a11y/no-autofocus": ["error", { ignoreNonDOM: true }],

                // A non-interactive element does not support event handlers (mouse and key handlers)
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-distracting-elements.md
                "jsx-a11y/no-distracting-elements": [
                    "error",
                    {
                        elements: ["marquee", "blink"],
                    },
                ],

                // ensure emoji are accessible
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/accessible-emoji.md
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-interactive-element-to-noninteractive-role.md
                "jsx-a11y/no-interactive-element-to-noninteractive-role": [
                    "error",
                    {
                        tr: ["none", "presentation"],
                    },
                ],

                // elements with aria-activedescendant must be tabbable
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-interactions.md
                "jsx-a11y/no-noninteractive-element-interactions": [
                    "error",
                    {
                        handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"],
                    },
                ],

                // ensure iframe elements have a unique title
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-to-interactive-role.md
                "jsx-a11y/no-noninteractive-element-to-interactive-role": [
                    "error",
                    {
                        li: ["menuitem", "option", "row", "tab", "treeitem"],
                        ol: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree", "treegrid"],
                        table: ["grid"],
                        td: ["gridcell"],
                        ul: ["listbox", "menu", "menubar", "radiogroup", "tablist", "tree", "treegrid"],
                    },
                ],

                // prohibit autoFocus prop
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-tabindex.md
                "jsx-a11y/no-noninteractive-tabindex": [
                    "error",
                    {
                        roles: ["tabpanel"],
                        tags: [],
                    },
                ],

                // ensure HTML elements do not specify redundant ARIA roles
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-onchange.md
                "jsx-a11y/no-onchange": "off",

                // media elements must have captions
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-redundant-roles.md
                "jsx-a11y/no-redundant-roles": "error",

                // WAI-ARIA roles should not be used to convert an interactive element to non-interactive
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md
                "jsx-a11y/no-static-element-interactions": [
                    "error",
                    {
                        handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"],
                    },
                ],

                // WAI-ARIA roles should not be used to convert a non-interactive element to interactive
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-has-required-aria-props.md
                "jsx-a11y/role-has-required-aria-props": "error",

                // Tab key navigation should be limited to elements on the page that can be interacted with.
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-supports-aria-props.md
                "jsx-a11y/role-supports-aria-props": "error",

                // ensure <a> tags are valid
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/scope.md
                "jsx-a11y/scope": "error",

                // Ensure the autocomplete attribute is correct and suitable for the form field it is used with
                // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/tabindex-no-positive.md
                "jsx-a11y/tabindex-no-positive": "error",

                ...overrides,
            },
        },
    ];
});

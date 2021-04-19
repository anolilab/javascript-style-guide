export default {
    plugins: ["stylelint-a11y"],
    rules: {
        // Require certain styles if the animation or transition in media features
        // "a11y/media-prefers-reduced-motion": true, @see https://github.com/YozhikM/stylelint-a11y/issues/49

        // Disallow unaccessible CSS generated content in pseudo-elements
        "a11y/content-property-no-static-value": true,
        // Disallow font sizes less than 15px
        "a11y/font-size-is-readable": true,

        // Disallow not vertical rhythmed line-height
        "a11y/line-height-is-vertical-rhythmed": true,

        // Require implementation of certain styles for selectors with colors.
        // 'a11y/media-prefers-color-scheme': true,

        // Disallow content hiding with display: none property
        "a11y/no-display-none": true,

        // Disallow obsolete attribute using
        "a11y/no-obsolete-attribute": true,

        // Disallow obsolete selectors using
        "a11y/no-obsolete-element": true,

        // Require width of text in a comfortable range
        // 'a11y/no-spread-text': true,

        // Disallow outline clearing
        "a11y/no-outline-none": true,

        // Disallow content with text-align: justify
        "a11y/no-text-align-justify": true,

        // Require or disallow a pseudo-element to the selectors with :hover
        "a11y/selector-pseudo-class-focus": true,
    },
};

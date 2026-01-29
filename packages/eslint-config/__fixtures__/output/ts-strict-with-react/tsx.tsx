export const Component1 = () => <div />;

export function jsx2() {
    const props = { a: 1, b: 2 };

    return (
        <a bar="foo" foo="bar">
            <div {...props} a={1} b="2">
                Inline Text
            </div>
            <Component1>Block Text</Component1>
            <div>
                Mixed
                <div>Foo</div>
                Text
                <b> Bar</b>
            </div>
            <p>
                foo
                <i>bar</i>
                <b>baz</b>
            </p>
        </a>
    );
}

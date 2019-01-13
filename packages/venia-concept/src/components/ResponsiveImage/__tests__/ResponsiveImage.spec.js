import React from 'react';
import TestRenderer from 'react-test-renderer';

import ResponsiveImage from './';

test('renders an img tag when no render prop is passed', () => {
    const testInstance = TestRenderer.create(
        <ResponsiveImage
            alt="An image"
            className="foo-class"
            sizes="(max-width: 240px) 80vw"
            src="/a/product/img.jpg"
            type="product"
            widthOptions={[160, 480, 1024, 800]}
        />
    );
    expect(
        testInstance.findByProps({
            alt: 'An image',
            className: 'foo-class',
            sizes: '(max-width: 240px) 80vw, 1024px',
            src: '/resize/1024w/media/catalog/product/a/product/img.jpg',
            srcSet:
                '/resize/160w/media/catalog/product/a/product/img.jpg 160w, /resize/480w/media/catalog/product/a/product/img.jpg 480x, /resize/1024w/media/catalog/product/a/product/img.jpg 1024w, /resize/800w/media/catalog/product/a/product/img.jpg 800w'
        })
    ).toBeTruthy();
});

test('passes props to a render function', () => {
    const render = jest.fn().mockName('render');
    render.mockImplementation(({ className, src, srcSet, sizes, alt }) => (
        <span
            data-cls={className}
            data-alt={alt}
            data-sz={sizes}
            data-s={src}
            data-srcs={srcSet}
        />
    ));
    const testInstance = TestRenderer.create(
        <ResponsiveImage
            alt="An image property set"
            className="bar-class"
            sizes="(max-width: 240px) 80vw"
            src="/c/cat.jpg"
            type="category"
            widthOptions={[480, 1024, 800]}
            render={render}
        />
    );
    expect(testInstance.toJSON()).toMatchInlineSnapshot();
    expect(render).toHaveBeenCalledWith(
        expect.objectContaining({
            alt: 'An image property set',
            className: 'bar-class',
            sizes: '(max-width: 240px) 80vw, 1024px',
            src: '/resize/1024w/media/catalog/category/c/cat.jpg',
            srcSet:
                '/resize/480w/media/catalog/category/c/cat.jpg 480w, /resize/1024w/media/catalog/category/c/cat.jpg 1024w, /resize/800w/media/catalog/category/c/cat.jpg 800w,'
        })
    );
});

test('passes props and image to a render function with multiple args', () => {
    const render = ({ className, src, srcSet, sizes, alt }, image) => (
        <span
            data-cls={className}
            data-alt={alt}
            data-sz={sizes}
            data-s={src}
            data-srcs={srcSet}
        >
            {image}
        </span>
    );
    const testInstance = TestRenderer.create(
        <ResponsiveImage
            alt="An image property set"
            className="bar-class"
            sizes="(max-width: 240px) 80vw"
            src="/c/cat.jpg"
            type="category"
            widthOptions={[480, 1024, 800]}
            render={render}
        />
    );
    expect(testInstance.toJSON()).toMatchInlineSnapshot();
});

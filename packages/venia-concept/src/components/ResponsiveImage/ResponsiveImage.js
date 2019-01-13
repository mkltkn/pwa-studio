import React, { Component } from 'react';
import { arrayOf, func, number, oneOf, string } from 'prop-types';
import makeMediaUrl from 'src/util/makeMediaUrl';

class ResponsiveImage extends Component {
    static propTypes = {
        className: string,
        render: func,
        sizes: string.isRequired,
        src: string,
        type: oneOf(['product', 'category', 'other']).isRequired,
        widthOptions: arrayOf(number).isRequired
    };
    render() {
        const {
            className,
            render,
            sizes,
            src,
            type,
            widthOptions
        } = this.props;
        const fallbackWidth = Math.max(...widthOptions);
        const renderArgs = {
            alt,
            className,
            sizes: sizes + `, ${fallbackWidth}px`,
            src: makeMediaUrl(src, { type, width: fallbackWidth }),
            srcSet: widthOptions
                .map(width => `${makeMediaUrl(src, { width, type })} ${width}w`)
                .join(', ')
        };
        // if the render fn only wants the render attributes, don't
        // bother to generate an image
        if (render && render.length < 2) {
            return render(renderArgs);
        }
        // otherwise, render a default image
        const image = <img alt={alt} {...renderArgs} />;
        return render ? render(renderArgs, image) : image;
    }
}

export default ResponsiveImage;

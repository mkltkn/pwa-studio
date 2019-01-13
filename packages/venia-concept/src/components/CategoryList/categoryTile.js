import React, { Component } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import ResponsiveImage from 'src/components/ResponsiveImage';
import classify from 'src/classify';
import defaultClasses from './categoryTile.css';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';

class CategoryTile extends Component {
    static propTypes = {
        item: shape({
            image: string,
            name: string.isRequired,
            productImagePreview: shape({
                items: arrayOf(
                    shape({
                        small_image: string
                    })
                )
            }),
            url_key: string.isRequired
        }).isRequired,
        classes: shape({
            item: string,
            image: string,
            imageWrapper: string,
            name: string
        }).isRequired
    };

    get imageInfo() {
        if (!this.props.item) {
            return null;
        }
        const { image, productImagePreview } = this.props.item;
        if (image) {
            return {
                src: image,
                type: 'category'
            };
        }
        if (productImagePreview.items[0]) {
            return {
                src: productImagePreview.items[0].small_image,
                type: 'product'
            };
        }
    }

    render() {
        const { imageInfo, props } = this;
        const { classes, item } = props;

        let imagePreview = null;
        if (imageInfo && imageInfo.src && imageInfo.type) {
            imagePreview = (
                <ResponsiveImage
                    alt={item.name}
                    className={classes.image}
                    sizes="(max-width: 320px) 40vw, (min-width: 640px 30vw"
                    widthOptions={[240, 640]}
                    src={imageInfo.src}
                    type={imageInfo.type}
                    render={({ src }, image) => {
                        // interpolation doesn't work inside `url()` for legacy
                        // reasons so a custom property should wrap its value in
                        // `url()`. Additionally, use the fallback (large) src
                        // instead of CSS image-set until image-set gains more
                        // browser share.
                        const imageUrl = src ? `url(${src})` : 'none';
                        const style = { '--venia-image': imageUrl };
                        return (
                            <span
                                className={classes.imageWrapper}
                                style={style}
                            >
                                {image}
                            </span>
                        );
                    }}
                />
            );
        }

        return (
            <Link
                className={classes.root}
                to={`/${item.url_key}${categoryUrlSuffix}`}
            >
                {imagePreview}
                <span className={classes.name}>{item.name}</span>
            </Link>
        );
    }
}

export default classify(defaultClasses)(CategoryTile);

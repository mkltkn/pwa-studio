import React, { Component } from 'react';
import { string, number, shape, func, bool } from 'prop-types';
import { Price } from '@magento/peregrine';
import { Link } from 'react-router-dom';
import classify from 'src/classify';
import { transparentPlaceholder } from 'src/shared/images';
import defaultClasses from './item.css';

const FALLBACK_IMAGE_WIDTH = 300;

const imageWidth = '40vw';
const imageHeight = '30vh';

const ItemPlaceholder = ({ children, classes }) => (
    <div className={classes.root_pending}>
        <div className={classes.images_pending}>{children}</div>
        <div className={classes.name_pending} />
        <div className={classes.price_pending} />
    </div>
);

// TODO: get productUrlSuffix from graphql when it is ready
const productUrlSuffix = '.html';

class GalleryItem extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            image_pending: string,
            imagePlaceholder: string,
            imagePlaceholder_pending: string,
            images: string,
            images_pending: string,
            name: string,
            name_pending: string,
            price: string,
            price_pending: string,
            root: string,
            root_pending: string
        }),
        getImageUrl: func.isRequired,
        imageSizes: arrayOf(number),
        item: shape({
            id: number.isRequired,
            name: string.isRequired,
            small_image: string.isRequired,
            url_key: string.isRequired,
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        value: number.isRequired,
                        currency: string.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        }),
        onError: func,
        onLoad: func,
        showImage: bool
    };

    static defaultProps = {
        imageSizes: [],
        onError: () => {},
        onLoad: () => {}
    };

    /**
     * TODO: Product images are currently broken and pending a fix from the `graphql-ce` project
     * https://github.com/magento/graphql-ce/issues/88
     */
    get image() {
        const {
            classes,
            item,
            getImageUrl,
            imageSizes,
            showImage
        } = this.props;

        if (!item) {
            return null;
        }

        const { small_image, name } = item;
        const className = showImage ? classes.image : classes.image_pending;

        return (
            <img
                className={className}
                srcset={imageSizes
                    .map(
                        width =>
                            `${getImageUrl(small_image, { width })} ${width}w`
                    )
                    .join(', ')}
                sizes={GalleryItem.sizes}
                src={getImageUrl(small_image)}
                alt={name}
                onLoad={this.handleLoad}
                onError={this.handleError}
            />
        );
    }

    get imagePlaceholder() {
        const { classes, item, showImage } = this.props;

        if (showImage) {
            return null;
        }

        const className = item
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        return (
            <img
                className={className}
                sizes={GalleryItem.sizes}
                src={transparentPlaceholder}
                alt=""
                width={imageWidth}
                height={imageHeight}
            />
        );
    }

    render() {
        const { classes, item } = this.props;

        if (!item) {
            return (
                <ItemPlaceholder classes={classes}>
                    {this.imagePlaceholder}
                </ItemPlaceholder>
            );
        }

        const { name, price, url_key } = item;
        const productLink = `/${url_key}${productUrlSuffix}`;

        return (
            <div className={classes.root}>
                <Link to={productLink} className={classes.images}>
                    {this.imagePlaceholder}
                    {this.image}
                </Link>
                <Link to={productLink} className={classes.name}>
                    <span>{name}</span>
                </Link>
                <div className={classes.price}>
                    <Price
                        value={price.regularPrice.amount.value}
                        currencyCode={price.regularPrice.amount.currency}
                    />
                </div>
            </div>
        );
    }

    handleLoad = () => {
        const { item, onLoad } = this.props;

        onLoad(item.id);
    };

    handleError = () => {
        const { item, onError } = this.props;

        onError(item.id);
    };
}

export default classify(defaultClasses)(GalleryItem);

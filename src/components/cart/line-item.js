import * as React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import GatsbyImage from 'gatsby-image';
import {
  useRemoveItemFromCart,
  useUpdateItemQuantity,
} from 'gatsby-theme-shopify-manager';
import { HiChevronLeft, HiChevronRight, HiTrash } from 'react-icons/hi';
import PropTypes from 'prop-types';

function LineItem({ item }) {
  const {
    allShopifyProductVariant: { nodes: variants },
    allShopifyProduct: { nodes: products },
  } = useStaticQuery(graphql`
    query {
      allShopifyProductVariant {
        nodes {
          shopifyId
          image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 630) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
      allShopifyProduct {
        nodes {
          handle
          variants {
            shopifyId
          }
        }
      }
    }
  `);

  const removeFromCart = useRemoveItemFromCart();
  const updateQuantity = useUpdateItemQuantity();

  const betterProductHandles = products.map((product) => {
    const newVariants = product.variants.map((variant) => variant.shopifyId);
    return {
      variants: newVariants,
      handle: product.handle,
    };
  });

  function getHandleForVariant(variantId) {
    const selectedProduct = betterProductHandles.find((product) => {
      return product.variants.includes(variantId);
    });

    return selectedProduct ? selectedProduct.handle : null;
  }

  function getImageFluidForVariant(variantId) {
    const selectedVariant = variants.find((variant) => {
      return variant.shopifyId === variantId;
    });

    if (selectedVariant) {
      return selectedVariant.image.localFile.childImageSharp.fluid;
    }
    return null;
  }

  const [quantity, setQuantity] = React.useState(item.quantity);

  function handleDecreaseQuantity() {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  }

  function handleIncreaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  // React.useEffect(() => {
  //   if (quantity <= 0) {
  //     removeFromCart(item.variant.id);
  //     return;
  //   }
  //   updateQuantity(item.variant.id, quantity);
  // }, [item.variant.id, quantity, removeFromCart, updateQuantity]);

  return (
    <div className="flex max-w-sm px-4 py-6 pt-4 bg-white rounded-lg shadow lg:max-w-none lg:items-center lg:justify-between">
      <div className="flex flex-col w-full lg:flex-row lg:items-center">
        <div className="relative w-full h-0 lg:h-auto lg:w-48 aspect-w-1 aspect-h-1 lg:aspect-none">
          <div className="absolute inset-0 flex bg-white">
            <GatsbyImage
              fluid={getImageFluidForVariant(item.variant.id)}
              className="flex-1 rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 lg:ml-4">
          <Link
            to={`/products/${getHandleForVariant(item.variant.id)}`}
            className="text-lg font-medium transition duration-150 ease-in-out hover:text-gray-600"
          >
            {item.title}
          </Link>
          <dl className="mt-2 text-base text-gray-500">
            {item.variant.selectedOptions.map(
              ({ name, value }) =>
                name !== 'Title' && (
                  <div key={name}>
                    <dt className="inline font-medium text-gray-500">
                      {name}:{' '}
                    </dt>
                    <dd className="inline mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
                      {value}
                    </dd>
                  </div>
                )
            )}
          </dl>
          <div className="flex items-end justify-between w-full pt-2 mt-auto">
            <div>
              <div className="font-medium text-gray-500">Quantity:</div>
              <div className="relative z-0 inline-flex mt-1 -space-x-px shadow-sm">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={item.quantity < 1}
                  className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10"
                >
                  <span className="sr-only">
                    {quantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
                  </span>
                  {quantity <= 1 ? (
                    <HiTrash className="w-5 h-5" aria-hidden />
                  ) : (
                    <HiChevronLeft className="w-5 h-5" aria-hidden />
                  )}
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10"
                >
                  <span className="sr-only">Increase quantity</span>
                  <HiChevronRight className="w-5 h-5" aria-hidden />
                </button>
              </div>
            </div>
            <div className="hidden lg:items-baseline lg:flex">
              <button
                onClick={() => removeFromCart(item.variant.id)}
                type="button"
                className="text-gray-800 underline transition duration-150 ease-in-out hover:text-gray-600"
              >
                Remove from cart
              </button>
              <div className="font-mono text-3xl text-pink-500 lg:ml-4">
                ${Number(item.variant.priceV2.amount * quantity).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LineItem.propTypes = {
  item: PropTypes.object,
};

export { LineItem };

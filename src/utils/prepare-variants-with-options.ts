/*
prepareVariantsWithOptions()
This function changes the structure of the variants to
more easily get at their options. The original data
structure looks like this:
{
  "shopifyId": "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc4NDQ4MTAzMDE4OA==",
  "selectedOptions": [
    {
      "name": "Color",
      "value": "Red"
    },
    {
      "name": "Size",
      "value": "Small"
    }
  ]
},
This function accepts that and outputs a data structure that looks like this:
{
  "shopifyId": "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMTc4NDQ4MTAzMDE4OA==",
  "color": "Red",
  "size": "Small"
},
*/

import { ShopifyImage, ShopifyVariant } from '../types/shopify-product';

type VariantWithOptions = {
  image: ShopifyImage;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{ name: string; value: string }>;
  shopifyId: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
function prepareVariantsWithOptions(variants: ShopifyVariant[]) {
  return variants.map((variant) => {
    // convert the options to a dictionary instead of an array
    const optionsDictionary = variant.selectedOptions.reduce(
      (options, option) => {
        // eslint-disable-next-line no-param-reassign
        options[`${option.name.toLowerCase()}`] = option.value;
        return options;
      },
      {}
    );

    // return an object with all of the variant properties + the options at the top level
    return {
      ...optionsDictionary,
      ...variant,
    };
  });
}

export { prepareVariantsWithOptions };
export type { VariantWithOptions };

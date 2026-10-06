import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from '../generated/api';

const COFFEE_PRODUCT_TYPE = 'Zrnková káva';
const MIN_DISTINCT_PRODUCTS = 2;
const DISCOUNT_PERCENTAGE = 10;
const DISCOUNT_MESSAGE = 'Ochutnej nový původ −10 %';

/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  // B2B zákazníci mají vlastní ceník
  if (input.cart.buyerIdentity?.purchasingCompany) {
    return {operations: []};
  }

  const hasProductDiscountClass = input.discount.discountClasses.includes(
    DiscountClass.Product,
  );

  if (!hasProductDiscountClass) {
    return {operations: []};
  }

  const coffeeLines = input.cart.lines.filter((line) => {
    const merchandise = line.merchandise;
    return (
      merchandise.__typename === 'ProductVariant' &&
      merchandise.product.productType === COFFEE_PRODUCT_TYPE &&
      !merchandise.product.isBlend
    );
  });

  const distinctProductIds = new Set(
    coffeeLines.map((line) => line.merchandise.product.id),
  );

  if (distinctProductIds.size < MIN_DISTINCT_PRODUCTS) {
    return {operations: []};
  }

  const cheapestLine = coffeeLines.reduce((minLine, line) => {
    if (
      Number(line.cost.amountPerQuantity.amount) <
      Number(minLine.cost.amountPerQuantity.amount)
    ) {
      return line;
    }
    return minLine;
  }, coffeeLines[0]);

  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              message: DISCOUNT_MESSAGE,
              targets: [
                {
                  cartLine: {
                    id: cheapestLine.id,
                  },
                },
              ],
              value: {
                percentage: {
                  value: DISCOUNT_PERCENTAGE,
                },
              },
            },
          ],
          selectionStrategy: ProductDiscountSelectionStrategy.First,
        },
      },
    ],
  };
}

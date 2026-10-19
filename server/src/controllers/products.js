import { notFound } from '../lib/errors.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { findProductBySlug, listOccasionsForProduct, listProducts } from '../db/products.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { collection, occasion } = req.validatedQuery;
  const products = await listProducts({ collectionSlug: collection, occasionSlug: occasion });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const slug = req.validatedParams.slug;
  const product = await findProductBySlug(slug);
  if (!product) throw notFound('Product not found');

  const occasions = await listOccasionsForProduct(product.id);
  res.json({ product: { ...product, occasions } });
});

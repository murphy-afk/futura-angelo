import { notFound } from '../lib/errors.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { findCollectionBySlug, listCollections, listProductsByCollection } from '../db/collections.js';

export const getCollections = asyncHandler(async (req, res) => {
  const collections = await listCollections();
  res.json({ collections });
});

export const getCollection = asyncHandler(async (req, res) => {
  const slug = req.validatedParams.slug;
  const collection = await findCollectionBySlug(slug);
  if (!collection) throw notFound('Collection not found');

  const products = await listProductsByCollection(collection.id);
  res.json({ collection: { ...collection, products } });
});

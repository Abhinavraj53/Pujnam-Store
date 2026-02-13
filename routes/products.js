const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database connection not ready. Please try again in a moment.' });
        }
        
        const { category, featured, bestseller, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;

        const query = { isActive: true };

        if (category) query.category = category;
        if (featured === 'true') query.featured = true;
        if (bestseller === 'true') query.isBestseller = true;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create product (Admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk create products (Admin only)
router.post('/bulk', adminAuth, async (req, res) => {
    try {
        const items = Array.isArray(req.body?.products) ? req.body.products : [];
        const updateStockOnDuplicate = req.body?.updateStockOnDuplicate === true;
        if (items.length === 0) {
            return res.status(400).json({ error: 'No products provided' });
        }

        const normalizeName = (name) => String(name || '').trim().toLowerCase();
        const normalizePrice = (price) => {
            const parsed = Number(price);
            if (!Number.isFinite(parsed)) return 0;
            return parsed;
        };
        const buildKey = (nameKey, priceValue) => `${nameKey}::${normalizePrice(priceValue)}`;
        const incomingNameKeys = [...new Set(items.map((item) => normalizeName(item?.name)).filter(Boolean))];

        const existingProducts = incomingNameKeys.length > 0
            ? await Product.aggregate([
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        stock: 1,
                        isActive: 1,
                        updatedAt: 1,
                        nameKey: {
                            $toLower: {
                                $trim: { input: '$name' }
                            }
                        }
                    }
                },
                {
                    $match: {
                        nameKey: { $in: incomingNameKeys }
                    }
                },
                {
                    $sort: { updatedAt: -1 }
                },
                {
                    $group: {
                        _id: { nameKey: '$nameKey', price: '$price' },
                        doc: { $first: '$$ROOT' },
                        stocks: { $addToSet: '$stock' }
                    }
                }
            ])
            : [];

        const existingByName = new Map();
        existingProducts.forEach((p) => {
            if (p?._id?.nameKey && p?.doc) {
                const compositeKey = buildKey(p._id.nameKey, p._id.price);
                if (!existingByName.has(compositeKey)) {
                    existingByName.set(compositeKey, {
                    ...p.doc,
                    allStocks: Array.isArray(p.stocks) ? p.stocks : [p.doc.stock]
                });
                }
            }
        });

        const results = [];
        for (let i = 0; i < items.length; i += 1) {
            const payload = items[i] || {};
            const nameKey = normalizeName(payload?.name);
            const priceValue = normalizePrice(payload?.price);
            const compositeKey = buildKey(nameKey, priceValue);

            if (!nameKey) {
                results.push({
                    index: i,
                    status: 'error',
                    error: 'Product name is required',
                });
                continue;
            }

            try {
                const duplicate = existingByName.get(compositeKey);
                if (duplicate) {
                    const incomingStock = Number(payload.stock ?? 0);
                    const existingStock = Number(duplicate.stock ?? 0);
                    const allStocks = Array.isArray(duplicate.allStocks) ? duplicate.allStocks : [duplicate.stock];
                    const stockChanged = !allStocks.every((s) => Number(s ?? 0) === incomingStock);

                    if (stockChanged && updateStockOnDuplicate) {
                        const updatePatch = {
                            stock: incomingStock,
                            isActive: incomingStock > 0 ? (payload.isActive ?? true) : false,
                        };
                        const updated = await Product.findByIdAndUpdate(
                            duplicate._id,
                            updatePatch,
                            { new: true, runValidators: true }
                        );

                        if (!updated) {
                            results.push({
                                index: i,
                                status: 'error',
                                error: 'Duplicate found but failed to update stock',
                            });
                            continue;
                        }

                        existingByName.set(nameKey, {
                            ...duplicate,
                            stock: updated.stock,
                            isActive: updated.isActive,
                        });
                        results.push({
                            index: i,
                            status: 'updated_stock',
                            id: updated._id,
                            name: updated.name,
                            previousStock: existingStock,
                            newStock: Number(updated.stock ?? incomingStock),
                        });
                        continue;
                    }

                        results.push({
                            index: i,
                            status: 'duplicate',
                            id: duplicate._id,
                            name: duplicate.name,
                            price: Number(duplicate.price ?? 0),
                            existingStock,
                            incomingStock: Number(payload.stock ?? 0),
                            stockChanged,
                        });
                        continue;
                }

                const product = new Product(payload);
                await product.save();
                existingByName.set(compositeKey, {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    isActive: product.isActive,
                    nameKey,
                });
                results.push({ index: i, status: 'created', id: product._id });
            } catch (err) {
                results.push({
                    index: i,
                    status: 'error',
                    error: err?.message || 'Failed to create product',
                });
            }
        }

        const createdCount = results.filter(r => r.status === 'created').length;
        const updatedStockCount = results.filter(r => r.status === 'updated_stock').length;
        const duplicateCount = results.filter(r => r.status === 'duplicate').length;
        const errorCount = results.filter(r => r.status === 'error').length;

        res.status(201).json({
            message: `Bulk process finished. Created: ${createdCount}, Stock Updated: ${updatedStockCount}, Duplicates: ${duplicateCount}, Errors: ${errorCount}`,
            results,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update product (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

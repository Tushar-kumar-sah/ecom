// routes/productRoutes.js
// FULL UPDATED PRODUCT ROUTES
// JWT REMOVED FOR NOW
// ADD / EDIT / DELETE WORKING
// MATCHES YOUR PRODUCTS PAGE

const express = require("express");
const router = express.Router();

const Product =
  require("../models/Product");

/* ===================================
GET ALL PRODUCTS
/api/products
=================================== */
router.get("/", async (req, res) => {
  try {
    const keyword =
      req.query.keyword
        ? {
            name: {
              $regex:
                req.query.keyword,
              $options: "i",
            },
          }
        : {};

    const category =
      req.query.category
        ? {
            category:
              req.query.category,
          }
        : {};

    const priceFilter = {};

    if (req.query.min) {
      priceFilter.$gte =
        Number(
          req.query.min
        );
    }

    if (req.query.max) {
      priceFilter.$lte =
        Number(
          req.query.max
        );
    }

    const price =
      Object.keys(
        priceFilter
      ).length > 0
        ? {
            price:
              priceFilter,
          }
        : {};

    const products =
      await Product.find({
        ...keyword,
        ...category,
        ...price,
      }).sort({
        createdAt: -1,
      });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
    });
  }
});

/* ===================================
GET SINGLE PRODUCT
/api/products/:id
=================================== */
router.get(
  "/:id",
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product not found",
          });
      }

      res.json(product);
    } catch {
      res.status(404).json({
        success: false,
        message:
          "Invalid product id",
      });
    }
  }
);

/* ===================================
ADD PRODUCT
/api/products
=================================== */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      image,
      stock,
      brand,
    } = req.body;

    const product =
      new Product({
        name,
        price:
          Number(price) ||
          0,
        category,
        description,
        image,
        stock:
          Number(stock) ||
          0,
        brand:
          brand ||
          "UK Traders",
      });

    const saved =
      await product.save();

    res.status(201).json({
      success: true,
      message:
        "Product added",
      product: saved,
    });
  } catch (error) {
    console.log(
      "ADD PRODUCT ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to add product",
    });
  }
});

/* ===================================
UPDATE PRODUCT
/api/products/:id
=================================== */
router.put(
  "/:id",
  async (req, res) => {
    try {
      const updated =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updated) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product not found",
          });
      }

      res.json({
        success: true,
        message:
          "Product updated",
        product:
          updated,
      });
    } catch (error) {
      console.log(
        "UPDATE ERROR:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update product",
      });
    }
  }
);

/* ===================================
DELETE PRODUCT
/api/products/:id
=================================== */
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const deleted =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Product not found",
          });
      }

      res.json({
        success: true,
        message:
          "Product deleted",
      });
    } catch (error) {
      console.log(
        "DELETE ERROR:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Delete failed",
      });
    }
  }
);

module.exports = router;
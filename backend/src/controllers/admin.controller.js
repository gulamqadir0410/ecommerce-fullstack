import cloudinary from "../config/cloudinary.js"
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";


//product controller
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    if (!req.files || req.files.length == 0) {
      return res.status(400).json({ message: "Atleast 1 Image is Required." });
    }
    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images Allowed" });
    }

    //Uploading to the cloudinary.

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, { folder: "products" });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => {
      return result.secure_url;
    });

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error Creating Product", error);
    res.status(500).json({ message: "Failed To Create Product" });
  }
};

export const getAllProducts = async (_, res) => {
  try {
    //-1 descending order most recent first.
    const products = Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Issue in Fethcing Products", error);
    res.status(500).json({ message: "Cannot Fetch All Products" });
  }
};

export const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (stock) product.stock = Number(stock);
    if (category) product.category = category;

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximum 3 Images Allowed" });
      }

      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      );

      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map(result => result.secure_url);
    }

    await product.save();

    res.status(200).json(product);

  } catch (error) {
    console.error("Issue in Updating Products", error);
    res.status(500).json({ message: "Cannot Update The Product" });
  }
};


// orders controller 

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 })
    res.status(200).json(orders);
  }
  catch (error) {
    console.error("Issue in Fethcing Orders", error);
    res.status(500).json({ message: "Cannot Fetch All Orders" });
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const order = await Order.findById(orderId);

    if (!orderId) {
      return res.status(404).json({ message: `Cannot find Valid Order with id: ${orderId}` });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

  }
  catch (error) {
    console.error("Issue in Updating Order Status", error);
    res.status(500).json({ message: "Cannot Update Order Status" });
  }
}


//stats and customers controller

export const getAllCustomers = async (_, res) => {
  try {
    const customers = await User.find().sort({ createdAt: -1 }) //latest user first.
    res.status(200).json({ customers });

  }
  catch (error) {
    console.error("Issue in getting Customers", error);
    res.status(500).json({ message: "Cannot get users list." });
  }
}

export const getDashboardStats = async (_, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" }
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.totalPrice || 0;

    const totalProducts = Product.countDocuments();

    const totalCustomers = Product.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts
    })

  }
  catch (error) {
    console.error("Issue in getting Stats", error);
    res.status(500).json({ message: "Cannot get Stats Now." });
  }
}


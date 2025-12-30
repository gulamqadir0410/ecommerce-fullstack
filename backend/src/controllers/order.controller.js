import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import {Review} from "../models/review.model.js";

export async function createOrders(req, res) {
    try {
        const user = req.user;
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ message: "No Order Items" })
        }

        for (const item of orderItems) {
            const product = await Product.findById(item.product._id);
             if (!product) {
                return res.status(404).json({ error: `Product ${item.name} not found.` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Product Out Of Stock for ${product.name}` })
            }
        }

         const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
        });

        //update product stock. after making order decrement from the stock -1.
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
         }

        res.status(201).json({ message: "Order Created Successfully,", order });
    }
    catch (error) {
        console.error("Error in CreateOrder Controller");
        res.status(500).json({ message: "Cannot Create The Order" })
    }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // 1️⃣ Collect all order IDs
    const orderIds = orders.map(order => order._id);

    // 2️⃣ Fetch all reviews for these orders in ONE query
    const reviews = await Review.find({
      orderId: { $in: orderIds },
    });

    // 3️⃣ Create a Set of reviewed order IDs for O(1) lookup
    const reviewedOrderIds = new Set(
      reviews.map(review => review.orderId.toString())
    );

    // 4️⃣ Attach hasReviewed flag to each order
    const ordersWithReviewStatus = orders.map(order => ({
      ...order.toObject(),
      hasReceived: reviewedOrderIds.has(order._id.toString()),
    }));

    res.status(200).json({ orders: ordersWithReviewStatus });
  } catch (error) {
    console.error("Error in GetOrder Controller", error);
    res.status(500).json({ message: "Cannot Get The Order" });
  }
}

import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    if (!fullName || !streetAddress || !city || !state || !zipCode || !phoneNumber) {
      return res.status(400).json({
        message: "Missing required fields: fullName, streetAddress, city, state, zipCode, phoneNumber"
      });
    }

    const user = req.user;

    // If setting this address as default, unset others
    if (isDefault === true) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault ?? false,
    });

    await user.save();
    res.status(201).json({
      message: "Address Added Successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("addAddress method error", error);
    res
      .status(500)
      .json({ message: "Adding Address Was Unsuccessful", error });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("getAddresses method error", error);
    res
      .status(500)
      .json({ message: "Fetching Addresses Was Unsuccessful", error });
  }
}

export async function updateAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const { addressId } = req.params;
    const user = req.user;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    // If setting this address as default, unset others
    if (isDefault === true) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    address.label = label ?? address.label;
    address.fullName = fullName ?? address.fullName;
    address.streetAddress = streetAddress ?? address.streetAddress;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.zipCode = zipCode ?? address.zipCode;
    address.phoneNumber = phoneNumber ?? address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();
    res.status(200).json({
      message: "Address Updated Successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("updateAddress method error", error);
    res
      .status(500)
      .json({ message: "Updating Address Was Unsuccessful", error });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({
      message: "Address Deleted Successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("deleteAddress method error", error);
    res
      .status(500)
      .json({ message: "Deleting Address Was Unsuccessful", error });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      message: "Added to Wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("addToWishlist method error", error);
    res
      .status(500)
      .json({ message: "Adding to Wishlist Failed", error });
  }
}

export async function deleteFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    user.wishlist.pull(productId);
    await user.save();

    res.status(200).json({
      message: "Removed from Wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("deleteFromWishlist method error", error);
    res
      .status(500)
      .json({ message: "Removing from Wishlist Failed", error });
  }
}

export async function getWishlist(req, res) {
  try {
    const user = User.findById(req.user._id).populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("getWishlist method error", error);
    res
      .status(500)
      .json({ message: "Fetching Wishlist Failed", error });
  }
}

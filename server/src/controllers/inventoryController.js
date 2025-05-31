import Inventory from "../models/Inventory.js";
import InventoryRequest from "../models/InventoryRequest.js";

// GET: All inventory (visible to all)
export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ date: -1 });
    return res.status(200).json(inventory);
  } catch (error) {
    console.log(
      "Error in Inventory Controller (getAllInventory)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// ADMIN: Add inventory item
export const addinventoryItem = async (req, res) => {
  const { material, maker, model, remainingStock } = req.body;

  try {
    const item = new Inventory({
      material,
      maker,
      model,
      remainingStock,
    });
    await item.save();
    return res.status(201).json(item);
  } catch (error) {
    console.log(
      "Error in inventoryController (addInventoryItem)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// ADMIN : Update inventory item
export const updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) {
      return res.status(400).json({ message: "Item not found!" });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.log("Error in inventoryController (updateInventoryItem)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

//ADMIN : delete inventory item
export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }
    return res.json({ message: "Item deleted" });
  } catch (error) {
    console.log("Error in inventoryController (deleteInventoryItem)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

//Employee : Sumbit inventory change request
export const submitInventoryRequest = async (req, res) => {
  try {
    const { type, inventoryItem, data } = req.body;

    const request = new InventoryRequest({
      employee: req.user._id,
      inventoryItem,
      type,
      data,
    });
    await request.save();

    return res.status(201).json({ message: "Request submitted", request });
  } catch (error) {
    console.log(
      "Error in inventoryController (submitInventoryRequest)",
      error.message
    );
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// ADMIN : Get all invnetory requests
export const getAllInventoryRequests = async (req, res) => {
  try {
    const requests = await InventoryRequest.find()
      .populate("employee", "name email")
      .populate("inventoryItem");

    return res.status(200).json(requests);
  } catch (error) {
    console.log("Error in inventoryController (getAllInventoryRequests)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// ADMIN: Handle a request (Approve)
export const approveInventoryRequest = async (req, res) => {
  try {
    const request = await InventoryRequest.findById(req.params.id);

    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already handled" });
    }
    // Proceeding if request is found and not handled yet
    if (request.type === "add") {
      const newItem = new Inventory(request.data);
      await newItem.save();
    } else if (request.type === "update") {
      await Inventory.findByIdAndUpdate(request.inventoryItem, request.data, {
        new: true,
      });
    } else if (request.type === "delete") {
      await Inventory.findByIdAndDelete(request.inventoryItem);
    }

    request.status = "approved";
    await request.save();
    res.json({ message: "Request approved and action completed" });
  } catch (error) {
    console.log("Error in inventoryController (approveInventoryRequest)");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// ADMIN: Handle a request (Reject)
export const rejectInventoryRequest = async (req, res) => {
  try {
    const request = await InventoryRequest.findById(req.params.id);
    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already handled" });
    }

    //proceeding if request is found and is pending
    request.status = "rejected";
    await request.save();
    res.json({ message: "Request rejected" });
  } catch (error) {
    console.log("Error in inventoryController (rejectInventoryRequest)");
    res.status(500).json({ message: "Internal server error!" });
  }
};

const Item = require('../models/item.model');
const User = require('../models/user');

module.exports.addItems = async (req, res) => {
    try {
        const currentUser = req.user._id;
        const { itemName, price } = req.body;

        if (!itemName || !price) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // Check if the item already exists
        const existingItem = await Item.findOne({ itemName });
        if (existingItem) {
            return res.status(400).json({ message: `${itemName} already exists`, success: false });
        }

        // Create a new item
        const newItem = await Item.create({
            itemName,
            price,
            owner: currentUser
        });

        // Find the user and push the new item ID to their items array
        const user = await User.findById(currentUser);
        user.items.push(newItem._id);
        await user.save();

        res.status(201).json({ message: 'Item added successfully', success: true, newItem });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong", error: error.message, success: false });
    }
}


module.exports.getAllItems = async (req, res) => {
    try {
        const currentUser = req.user._id
        const items = await Item.find({ owner: currentUser }).populate({ path: 'owner', select: 'email' });
        if (!items) res.status(400).json({ message: "item not found", success: false })
        res.status(200).json({ message: 'Items fetched successfully', success: true, items })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message, success: false })

    }
}

module.exports.updataEditItem = async (req, res) => {
    try {
        const currentUser = req.user._id; // Get the current user's ID
        const { itemId } = req.params;    // Get the item ID from the request parameters
        const { itemName, price } = req.body; // Get the new item name and price from the request body

        // Find the item by its ID and owner (current user)
        const selectedItem = await Item.findOne({ _id: itemId, owner: currentUser });

        // If the item doesn't exist or isn't owned by the current user
        if (!selectedItem) {
            return res.status(404).json({ message: 'Item not found or not owned by user', success: false });
        }

        // Update the item with the new data
        selectedItem.itemName = itemName || selectedItem.itemName; // Update only if a new item name is provided
        selectedItem.price = price || selectedItem.price;      // Update only if a new price is provided

        // Save the updated item
        await selectedItem.save();

        res.status(200).json({ message: 'Item updated successfully', success: true, item: selectedItem });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong", error: error.message, success: false });
    }
};
module.exports.editItemDetail = async (req, res) => {
    try {
        const currentUser = req.user._id; // Get the current user's ID
        const { itemId } = req.params;    // Get the item ID from the request parameters


        // Find the item by its ID and owner (current user)
        const selectedItem = await Item.findOne({ _id: itemId, owner: currentUser });

        // If the item doesn't exist or isn't owned by the current user
        if (!selectedItem) {
            return res.status(404).json({ message: 'Item not found or not owned by user', success: false });
        }



        res.status(200).json({ message: 'Item', success: true, item: selectedItem });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Something went wrong", error: error.message, success: false });
    }
};

module.exports.deleteItems = async (req, res) => {
    try {
        const currentUser = req.user._id;
        const { itemId } = req.params;

        const item = await Item.findOneAndDelete({ _id: itemId, owner: currentUser });

        if (!item) {
            return res.status(404).json({ message: 'Item not found or not owned by user', success: false });
        }

        const user = await User.findById(currentUser);
        user.items.pull(itemId);
        await user.save();
        res.status(200).json({ message: 'Item deleted successfully', success: true });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message, success: false });
    }
};

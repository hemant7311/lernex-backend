const Category = require("../model/category");

// ================= ADD CATEGORY =================
exports.addCategory = async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name || !users) {
      return res.status(400).json({
        success: false,
        message: "Name and users are required"
      });
    }

    const category = new Category({
      name,
      users,
      image: req.file ? req.file.path : null
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= UPDATE CATEGORY =================
exports.updateCategory = async (req, res) => {
  try {
    const { name, users } = req.body;
    const { id } = req.params;

    if (!name || !users) {
      return res.status(400).json({
        success: false,
        message: "Name and users are required"
      });
    }

    const updateData = {
      name,
      users
    };

    // image optional on update
    if (req.file) {
      updateData.image = req.file.path;
    }

    await Category.findByIdAndUpdate(id, updateData);

    res.json({
      success: true,
      message: "Category updated successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= DELETE CATEGORY =================
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

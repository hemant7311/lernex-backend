const User = require("../model/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ================= SIGNUP =================
exports.adminsignup = async (req, res) => {
try {
const { adname, ademail, adpassword } = req.body;

```
const existing = await User.findOne({ ademail });

if (existing) {
  return res.status(400).json({
    success: false,
    message: "Email already exists ❌",
  });
}

const hashedPassword = await bcrypt.hash(adpassword, 10);

const user = await User.create({
  adname,
  ademail,
  adpassword: hashedPassword,
});

const token = jwt.sign(
  {
    id: user._id,
    name: user.adname,
    email: user.ademail,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  }
);

return res.status(201).json({
  success: true,
  message: "User registered successfully ✅",
  token,
});
```

} catch (err) {
return res.status(500).json({
success: false,
message: "Registration failed",
error: err.message,
});
}
};

// ================= LOGIN =================
exports.adminlogin = async (req, res) => {
try {
const { ademail, adpassword } = req.body;

```
if (!ademail || !adpassword) {
  return res.status(400).json({
    success: false,
    message: "Email and Password required",
  });
}

const user = await User.findOne({ ademail });

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found ❌",
  });
}

// For manually inserted password
const isMatch = adpassword === user.adpassword;

if (!isMatch) {
  return res.status(400).json({
    success: false,
    message: "Wrong password ❌",
  });
}

const token = jwt.sign(
  {
    id: user._id,
    name: user.adname,
    email: user.ademail,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  }
);

return res.status(200).json({
  success: true,
  message: "Login successful ✅",
  token,
  user: {
    id: user._id,
    adname: user.adname,
    ademail: user.ademail,
  },
});
```

} catch (err) {
return res.status(500).json({
success: false,
message: "Login failed",
error: err.message,
});
}
};

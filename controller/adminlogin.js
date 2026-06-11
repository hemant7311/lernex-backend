const User = require("../model/admin");
const jwt = require("jsonwebtoken");

// ================= ADMIN SIGNUP =================
exports.adminsignup = async (req, res) => {
try {
const { adname, ademail, adpassword } = req.body;

```
const existing = await User.findOne({ ademail });

if (existing) {
  return res.status(400).json({
    success: false,
    message: "Email already exists",
  });
}

const user = await User.create({
  adname,
  ademail,
  adpassword,
});

res.status(201).json({
  success: true,
  message: "Admin created successfully",
  user,
});
```

} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// ================= ADMIN LOGIN =================
exports.adminlogin = async (req, res) => {
try {
const { ademail, adpassword } = req.body;

```
const user = await User.findOne({ ademail });

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

if (user.adpassword !== adpassword) {
  return res.status(400).json({
    success: false,
    message: "Wrong password",
  });
}

const token = jwt.sign(
  {
    id: user._id,
    email: user.ademail,
  },
  process.env.JWT_SECRET || "mysecretkey",
  {
    expiresIn: "7d",
  }
);

res.status(200).json({
  success: true,
  message: "Login Successful",
  token,
});
```

} catch (error) {
console.error(error);

```
res.status(500).json({
  success: false,
  message: error.message,
});
```

}
};

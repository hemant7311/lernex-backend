const axios = require("axios");
const Payment = require("../model/paymentschema"); // path check kar lena

exports.createPayment = async (req, res) => {
  try {
    const {
      type,
      pname,
      pprice,
      pquantity,
      pid,
      cusid,
      courses,
    } = req.body;

    // 🔒 BASIC VALIDATION
    if (!cusid || !type) {
      return res.status(400).json({
        success: false,
        message: "cusid & type required",
      });
    }

    const orderId = `ORD_${Date.now()}`;
    let orderAmount = 0;
    let paymentData = {};

    // ================= BUY ALL COURSES =================
    if (type === "BUY_ALL") {
      if (!Array.isArray(courses) || courses.length === 0) {
        return res.status(400).json({
          success: false,
          message: "courses array required",
        });
      }

      orderAmount = courses.reduce(
        (sum, c) => sum + Number(c.price),
        0
      );

      paymentData.courses = courses.map((c) => ({
        productId: c.id,
        productName: c.title || "Course",
        price: Number(c.price),
      }));
      paymentData.quantity = courses.length;
    }

    // ================= SINGLE COURSE =================
    if (type === "SINGLE") {
      if (!pname || !pprice || !pquantity || !pid) {
        return res.status(400).json({
          success: false,
          message: "product fields missing",
        });
      }

      orderAmount = Number(pprice) * Number(pquantity);

      paymentData.productId = pid;
      paymentData.productName = pname;
      paymentData.quantity =Number(pquantity);
    }

    // ================= CASHFREE ORDER =================
    const response = await axios.post(
      `${process.env.CASHFREE_BASE_URL}/orders`,
      {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",

        customer_details: {
          customer_id: cusid,
          customer_email: "customer@test.com",
          customer_phone: "9999999999",
        },

        // ✅ CORRECT RETURN URL (HTTP + lowercase route)
        order_meta: {
          return_url: `https://localhost:5173/profile`
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    // 🔴 SAFETY CHECK
    if (!response.data.payment_session_id) {
      return res.status(500).json({
        success: false,
        message: "Cashfree session not created",
      });
    }

    // ================= SAVE TO DATABASE =================
    const payment = new Payment({
      user: req.user.id, // JWT middleware se
      ...paymentData,
      amount: orderAmount,
      orderId: orderId,
      paymentSessionId: response.data.payment_session_id,
      paymentStatus: "PENDING",
      quantity: pquantity || paymentData.quantity,
    });

    await payment.save(); // ✅ DB SAVE

    return res.status(200).json({
      success: true,
      payment_session_id: response.data.payment_session_id,
      order_id: orderId,
    });

  } catch (err) {
    console.error("Cashfree Error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};

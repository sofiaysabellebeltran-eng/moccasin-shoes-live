import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;
const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const DB_FILE = path.join(process.cwd(), "orders.json");

if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: "moccasin.info@theljrgroup.com", pass: "aiod hzgz midh saqk" },
});

app.use(cors());
app.use(bodyParser.json());

app.post("/api/checkout", async (req, res) => {
  try {
    const { items, shippingFee, customer, reference, origin } = req.body;
    const lineItems = items.map(item => ({
      name: `${item.product.name} (Size ${item.size})`,
      amount: item.product.pricePhp * 100, 
      currency: "PHP",
      quantity: item.quantity,
    }));

    if (shippingFee > 0) lineItems.push({ name: "J&T Shipping", amount: shippingFee * 100, currency: "PHP", quantity: 1 });

    const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: lineItems,
            payment_method_types: ["qrph", "paymaya"],
            success_url: `${origin}/checkout/success`,
            cancel_url: `${origin}/cart`,
            reference_number: reference,
          },
        },
      }),
    });
    const data = await response.json();
    res.json({ checkoutUrl: data.data.attributes.checkout_url });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/manual-save", async (req, res) => {
  const { reference, customer, items, total } = req.body;
  
  try {
    let orders = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    if (!orders.find(o => o.reference === reference)) {
      orders.push({
        id: Date.now(), reference, customer_name: customer.name, email: customer.email,
        phone: customer.phone, address: customer.address, city: customer.city,
        items, total, status: "Paid", created_at: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2));
      console.log(`✅ Order ${reference} SAVED!`);
    }
  } catch (dbError) {
    return res.status(500).json({ error: "Database error" });
  }

  try {
    await transporter.sendMail({
      from: '"Moccasin PH" <moccasin.info@theljrgroup.com>',
      to: customer.email,
      subject: `Order Confirmed: ${reference}`,
      html: `<h2>Thank you for your order, ${customer.name}!</h2><p>We received your payment of ₱${total}.</p>`
    });
    console.log(`✅ Confirmation email sent!`);
  } catch (emailError) {
    console.error("❌ EMAIL FAILED:", emailError.message);
  }

  res.json({ success: true });
});

app.get("/api/admin/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  res.json(orders.reverse());
});

// FIXED: Now updates the JSON file, not the old database
app.post("/api/admin/ship", async (req, res) => {
  const { id, email, reference } = req.body;
  
  try {
    let orders = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    const orderIndex = orders.findIndex(o => o.id === id);
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = "Shipped";
      fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2));
      console.log(`🚚 Order ${reference} marked as SHIPPED!`);
    }
    
    await transporter.sendMail({
      from: '"Moccasin PH" <moccasin.info@theljrgroup.com>',
      to: email,
      subject: `Your Order is on the Way! (${reference})`,
      html: `<h2>Good news!</h2><p>Your Moccasins have been dispatched and are on their way to you.</p>`
    });
    console.log(`✅ Shipping email sent!`);
    
    res.json({ success: true });
  } catch (err) {
    console.error("❌ SHIP ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on http://127.0.0.1:${PORT}`));


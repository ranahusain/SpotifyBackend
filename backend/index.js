const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const users = require("./routes/UserRoutes");
const songs = require("./routes/SongsRoutes");
const playlists = require("./routes/PlaylistRoutes");
const cronJob = require("./routes/cronJob");

const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the Spotify backend API!");
});

app.use("/api", users);
app.use("/api", songs);
app.use("/api", playlists);

//stripe payment
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

// const staticDir =
//   process.env.STATIC_DIR || path.join(__dirname, "../my-app/dist");
// app.use(express.static(staticDir));

// app.get("/", (req, res) => {
//   const filePath = path.resolve(staticDir, "index.html");
//   res.sendFile(filePath);
// });

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.get("/test-cron", async (req, res) => {
  await cronJob();
  res.send("Cron job executed manually.");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

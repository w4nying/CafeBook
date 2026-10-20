const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

const dataPath = path.join(
  __dirname,
  "src",
  "data",
  "cafes.json"
);

app.use(cors());
app.use(express.json());

// Read all cafes from the JSON file
async function readCafes() {
  const data = await fs.readFile(dataPath, "utf8");
  return JSON.parse(data);
}

// GET /api/cafes
app.get("/api/cafes", async (req, res) => {
  try {
    const cafes = await readCafes();
    res.json(cafes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load cafes." });
  }
});

// POST /api/cafes
app.post("/api/cafes", async (req, res) => {
  try {
    const {
      name,
      country,
      address,
      phoneNumber,
      priceRange,
      rating,
    } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof country !== "string" || !country.trim() ||
      typeof address !== "string" || !address.trim() ||
      typeof priceRange !== "string" || !priceRange.trim()
    ) {
      return res.status(400).json({
        message: "Name, country, address and price range are required.",
      });
    }

    if (
      phoneNumber != null &&
      (typeof phoneNumber !== "string" ||
        !/^\+?[\d\s()-]+$/.test(phoneNumber.trim()))
    ) {
      return res.status(400).json({
        message: "Invalid phone number.",
      });
    }

    if (
      rating != null &&
      (typeof rating !== "number" ||
        !Number.isFinite(rating) ||
        rating < 1 ||
        rating > 5)
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    const cafes = await readCafes();

    const newCafe = {
      id: cafes.reduce(
        (maxId, cafe) => Math.max(maxId, cafe.id),
        0
      ) + 1,
      name: name.trim(),
      country: country.trim(),
      address: address.trim(),
      phoneNumber: phoneNumber?.trim() || null,
      priceRange: priceRange.trim(),
      rating: rating ?? null,
    };

    cafes.push(newCafe);

    await fs.writeFile(
      dataPath,
      JSON.stringify(cafes, null, 2) + "\n",
      "utf8"
    );

    res.status(201).json(newCafe);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save cafe.",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile").development);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of users.
 *     responses:
 *       200:
 *         description: A JSON array of user objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Alice
 *                   email:
 *                     type: string
 *                     example: alice@example.com
 */
router.get("/", async (req, res) => {
    try {
        const users = await knex("users").select("*");
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

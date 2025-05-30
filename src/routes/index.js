const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a greeting message.
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, World!
 */
router.get("/hello", (req, res) => {
    res.json({ message: "Hello, World!" });
});

module.exports = router;

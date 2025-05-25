
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../../knexfile").development);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user.
 *         name:
 *           type: string
 *           description: Full name of the user. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.
 *           maxLength: 100
 *         email:
 *           type: string
 *           description: Valid email address.
 *           format: email
 *           maxLength: 100
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             examples:
 *               example:
 *                 value:
 *                   - id: 1
 *                     name: "Alice"
 *                     email: "alice@example.com"
 *                   - id: 2
 *                     name: "Bob"
 *                     email: "bob@example.com"
 *                   - id: 3
 *                     name: "Charlie"
 *                     email: "charlie@example.com"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   error: "Internal server error. Please try again later."
 */
router.get("/", async (req, res) => {
    try {
        const users = await knex("users").select("*");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             validUser:
 *               value:
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             examples:
 *               userCreated:
 *                 value:
 *                   id: 4
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Missing Name or Email
 *                 value:
 *                   error: "Name and email are required"
 *               invalidEmail:
 *                 summary: Invalid email format
 *                 value:
 *                   error: "Invalid email format"
 *               invalidNameChars: 
 *                  summary: Name contains invalid characters
 *                  value:
 *                      error: "Name contains invalid characters. Only letters, spaces, hyphens (-), and apostrophes (') are allowed."
 *               nameTooLong:
 *                  summary: Name exceeds max length
 *                  value:
 *                      error: "Name must be 100 characters or less"
 *               emailTooLong:
 *                  summary: Email exceeds max length
 *                  value:
 *                      error: "Email must be 100 characters or less"
 *       409:
 *         description: Conflict - Email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               conflict:
 *                 value:
 *                   error: "Email already in use"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   error: "Internal server error. Please try again later."
 */
router.post("/", async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }
        const existing = await knex("users").where({ email }).first();
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }
        const [id] = await knex("users").insert({ name, email });
        const newUser = await knex("users").where({ id }).first();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             examples:
 *               userFound:
 *                 value:
 *                   id: 1
 *                   name: "Alice"
 *                   email: "alice@example.com"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   error: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 value:
 *                   error: "Internal server error. Please try again later."
 */
router.get("/:id", async (req, res) => {
    try {
        const user = await knex("users").where({ id: req.params.id }).first();
        if (user) res.json(user);
        else res.status(404).json({ error: "User not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Full name of the user. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *           examples:
 *             validUpdate:
 *               summary: Valid updated user
 *               value:
 *                 name: "Updated User"
 *                 email: "updated@example.com"
 *     responses:
 *       200:
 *         description: User updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *             examples:
 *               userUpdated:
 *                 summary: Sample updated user
 *                 value:
 *                   id: 3
 *                   name: "Updated User"
 *                   email: "updated@example.com"
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingFields:
 *                 summary: Missing Name or Email
 *                 value:
 *                   error: "Name and email are required"
 *               invalidEmail:
 *                 summary: Invalid email format
 *                 value:
 *                   error: "Invalid email format"
 *               invalidNameChars:
 *                  summary: Name contains invalid characters
 *                  value:
 *                      error: "Name contains invalid characters. Only letters, spaces, hyphens (-), and apostrophes (') are allowed."
 *               nameTooLong:
 *                  summary: Name exceeds max length
 *                  value:
 *                      error: "Name must be 100 characters or less"
 *               emailTooLong:
 *                  summary: Email exceeds max length
 *                  value:
 *                      error: "Email must be 100 characters or less"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *       409:
 *         description: Conflict - email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               conflict:
 *                 summary: Email conflict
 *                 value:
 *                   error: "Email already in use"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 summary: Server error
 *                 value:
 *                   error: "Internal server error. Please try again later."
 */
router.put("/:id", async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }
        const updated = await knex("users").where({ id: req.params.id }).update({ name, email });
        if (updated) {
            const user = await knex("users").where({ id: req.params.id }).first();
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               userDeleted:
 *                 summary: User deleted confirmation
 *                 value:
 *                   message: "User with ID 1 has been deleted."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               userNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User with ID 1 not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverError:
 *                 summary: Server error
 *                 value:
 *                   error: "Internal server error. Please try again later."
 */
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await knex("users").where({ id: req.params.id }).del();
        if (deleted) res.json({ message: "User deleted" });
        else res.status(404).json({ error: "User not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
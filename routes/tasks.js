const express = require("express");

const { isValidId, validateBody, authenticate } = require("../middlewares");
const {
    addTask,
    getMonthTasks,
    getTaskById,
    removeTask,
    updateTask
} = require("../controllers/tasksController");
const { joiTaskSchema, joiDate } = require("../schemas/tasks");

const router = express.Router();
router.use(authenticate);   

router.get("/:id", isValidId, getTaskById);
router.get("/", validateBody(joiDate), getMonthTasks);
router.post("/", validateBody(joiTaskSchema), addTask);
router.patch("/:id", isValidId, validateBody(joiTaskSchema), updateTask);
router.delete("/:id", isValidId, removeTask);


module.exports = router;
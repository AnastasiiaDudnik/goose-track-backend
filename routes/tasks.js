const express = require("express");

const {
  isValidId,
  validateBody,
  authenticate,
  validateQuery,
} = require("../middlewares");
const {
  addTask,
  getMonthTasks,
  getTaskById,
  removeTask,
  updateTask,
  getWeekTasks,
  getTasksStatistics,
} = require("../controllers/tasksController");
const { joiTaskSchema, joiDate, joiWeek } = require("../schemas/tasks");

const router = express.Router();
router.use(authenticate);

router.get("/week", validateQuery(joiWeek), getWeekTasks);
router.get("/:id", isValidId, getTaskById);
router.get("/", validateQuery(joiDate), getMonthTasks);
router.post("/", validateBody(joiTaskSchema), addTask);
router.post("/statistics", getTasksStatistics);
router.patch("/:id", isValidId, validateBody(joiTaskSchema), updateTask);
router.delete("/:id", isValidId, removeTask);

module.exports = router;

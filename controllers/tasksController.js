const controllerWrap = require("../decorators/controllerWrap");
const { HttpError } = require("../helpers");
const Tasks = require("../models/task");

//запит за місяць GET /tasks
const getMonthTasks = async (req, res, next) => {
  const { _id: owner } = req.user;
  const {
    years = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
  } = req.query;

  const startDate = new Date(years, month - 1).getTime();
  const endDate = new Date(years, month).getTime() - 1000;

  const tasks = await Tasks.find({
    owner,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  res.status(200).json({ tasks });
};

// запит за тиждень GET /tasks/week
const getWeekTasks = async (req, res, next) => {
  const { _id: owner } = req.user;

  const {
    years = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    day = new Date().getDate(),
  } = req.query;

  const startDate = new Date(years, month - 1, day).getTime();
  const endDate = new Date(years, month - 1, Number(day) + 7).getTime() - 1000;

  const tasks = await Tasks.find({
    owner,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  res.status(200).json({ tasks });
};

//створення POST /tasks
const addTask = async (req, res) => {
  const { _id: owner } = req.user;
  const task = await Tasks.create({
    ...req.body,
    owner,
  });

  res.status(201).json(task);
};

//отримання GET /tasks/:id
const getTaskById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const task = await Tasks.findOne({ _id: id, owner });

  if (!task) {
    throw new HttpError(404, `Task with "${id}" not found`);
  }
  res.json(task);
};

//редагування PATCH /tasks/:id
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const task = await Tasks.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });

  if (!task) {
    throw new HttpError(404, `Task with ${id} not found`);
  }

  res.json(task);
};

//видалення DELETE /tasks/:id
const removeTask = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;

  const removedTask = await Tasks.findOneAndDelete({ _id: id, owner });

  if (!removedTask) {
    throw new HttpError(404, `Task with "${id}" not found`);
  }

  res.json({ message: "Task deleted" });
};

const getTasksStatistics = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.body;
  const allTasks = await Tasks.find({ owner });

  let todoByDay = 0;
  let inprogressByDay = 0;
  let doneByDay = 0;
  let todoByMonth = 0;
  let inprogressByMonth = 0;
  let doneByMonth = 0;

  for (const task of allTasks) {
    const { category, date: taskDate } = task;
    const taskDateOnly = new Date(taskDate).toISOString().slice(0, 10);

    // Calculate daily statistics
    if (taskDateOnly === date) {
      switch (category) {
        case "to-do":
          todoByDay += 1;
          break;
        case "in-progress":
          inprogressByDay += 1;
          break;
        case "done":
          doneByDay += 1;
          break;
        default:
          break;
      }
    }

    const taskDateObj = new Date(taskDate);
    const providedDateObj = new Date(date);
    // Calculate monthly statistics
    if (
      taskDateObj.getFullYear() === providedDateObj.getFullYear() &&
      taskDateObj.getMonth() === providedDateObj.getMonth()
    ) {
      switch (category) {
        case "to-do":
          todoByMonth += 1;
          break;
        case "in-progress":
          inprogressByMonth += 1;
          break;
        case "done":
          doneByMonth += 1;
          break;
        default:
          break;
      }
    }
  }

  const allTasksByDay = todoByDay + inprogressByDay + doneByDay;
  const allTasksByMonth = todoByMonth + inprogressByMonth + doneByMonth;

  const todoByDayPercentage = parseInt(
    allTasksByDay !== 0 ? (todoByDay / allTasksByDay) * 100 : 0
  );
  const inprogressByDayPercentage = parseInt(
    allTasksByDay !== 0 ? (inprogressByDay / allTasksByDay) * 100 : 0
  );
  const doneByDayPercentage = parseInt(
    allTasksByDay !== 0 ? (doneByDay / allTasksByDay) * 100 : 0
  );

  const todoByMonthPercentage = parseInt(
    allTasksByMonth !== 0 ? (todoByMonth / allTasksByMonth) * 100 : 0
  );
  const inprogressByMonthPercentage = parseInt(
    allTasksByMonth !== 0 ? (inprogressByMonth / allTasksByMonth) * 100 : 0
  );
  const doneByMonthPercentage = parseInt(
    allTasksByMonth !== 0 ? (doneByMonth / allTasksByMonth) * 100 : 0
  );

  res.status(200).json({
    todoByDayPercentage,
    inprogressByDayPercentage,
    doneByDayPercentage,
    todoByMonthPercentage,
    inprogressByMonthPercentage,
    doneByMonthPercentage,
  });
};

module.exports = {
  getMonthTasks: controllerWrap(getMonthTasks),
  getWeekTasks: controllerWrap(getWeekTasks),
  addTask: controllerWrap(addTask),
  getTaskById: controllerWrap(getTaskById),
  updateTask: controllerWrap(updateTask),
  removeTask: controllerWrap(removeTask),
  getTasksStatistics: controllerWrap(getTasksStatistics),
};

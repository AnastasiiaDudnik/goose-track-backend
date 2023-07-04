
const controllerWrap = require("../decorators/controllerWrap");
const { HttpError } = require("../helpers");
const Tasks = require("../models/task");

//запит за місяць GET /tasks
const getMonthTasks = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { years = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

    const startDate = new Date(years, month - 1).getTime();
    const endDate = new Date(years, month).getTime() - 1000;

    const tasks = await Tasks.find({ owner, date: { $gte: new Date(startDate), $lte: new Date(endDate) } });

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

module.exports = {
    getMonthTasks: controllerWrap(getMonthTasks),
    addTask: controllerWrap(addTask),
    getTaskById: controllerWrap(getTaskById),
    updateTask: controllerWrap(updateTask),
    removeTask: controllerWrap(removeTask),
}
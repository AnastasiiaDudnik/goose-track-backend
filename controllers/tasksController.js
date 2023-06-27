const controllerWrap = require("../decorators/controllerWrap");
const { HttpError } = require("../helpers");
const Tasks = require("../models/task");

//запит за місяць GET /tasks
const getMonthTasks = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { date } = req.body;

    const [e, m, d] = date.split('-');
    const startDate = new Date(e, m - 1).getTime();
    const endDate = new Date(e, m).getTime() -1000; 

    const tasks =  await Tasks.find({ owner, date: {$gte: new Date(startDate), $lte: new Date(endDate)}});


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

//отримання GET /tasks/:taskId 
const getTaskById = async (req, res) => {
    const { taskId } = req.params;

    const task = await Tasks.findById(taskId);

    if (!task) {
        throw new HttpError(404, `Task with "${taskId}" not found`);
    }
    res.json(task);
};

//редагування PATCH /tasks/:taskId
const updateTask = async (req, res) => {
    const { taskId } = req.params;

    const task = await Tasks.findByIdAndUpdate(taskId, req.body, {
        new: true,
    });

    if (!task) {
        throw new HttpError(404, `Contact with ${taskId} not found`);
    }

    res.json(task);
};

//видалення DELETE /tasks/:taskId
const removeTask = async (req, res) => {
    const { taskId } = req.params;

    const removedTask = await Tasks.findByIdAndRemove(taskId);

    if (!removedTask) {
        throw new HttpError(404, `Task with "${taskId}" not found`);
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
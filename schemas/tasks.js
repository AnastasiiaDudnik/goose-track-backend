const Joi = require("joi").extend(require('@joi/date'));

const categoryType = ["to-do", "in-progress", "done"];
const priorityType = ["low", "medium", "high"];

const joiTaskSchema = Joi.object({
  title: Joi.string().min(3).max(250).required(),

  start: Joi.string()
    .required(),

  end: Joi.string()
    .required(),

  priority: Joi.string()
    .valid(...priorityType)
    .required(),

  date: Joi.date()
    .format("YYYY-MM-DD")
    .required(),

  category: Joi.string()
    .valid(...categoryType)
    .required(),
});

const joiDate = Joi.object({
  years: Joi.date().format("YYYY"),
  month: Joi.date().format("MM"),
});

const joiWeek = Joi.object({
  years: Joi.date().format("YYYY"),
  month: Joi.date().format("MM"),
  day: Joi.date().format("DD"),
});

module.exports = { joiTaskSchema, joiDate, joiWeek };
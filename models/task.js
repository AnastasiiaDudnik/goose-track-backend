const { Schema, model } = require("mongoose");

const dateRegexp = /(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)/; //yyyy-mm-dd
const timeRegexp = /\d\d[-:]\d\d/g; //hh-mm

const categoryType = ["to-do", "in-progress", "done"];
const priorityType = ["low", "medium", "high"];

const taskSchema = new Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 250,
        required: [true, "Set title for your task"],
    },
    start: {
        type: String,
        match: timeRegexp,
        default: "09-00",
    },
    end: {
        type: String,
        match: timeRegexp,
        default: "09-30",
    },
    priority: {
        type: String,
        enum: priorityType,
        required: [true, "Set priority for your task"],
    },
    date: {
        type: Date,
        required: [true, "Set date for your task"],
    },
    category: {
        type: String,
        enum: categoryType,
        required: [true, "Set category for your task"],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
},
    { versionKey: false, timestamps: true }
);

const Tasks = model("tasks", taskSchema);

module.exports = Tasks;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new mongoose.Schema({
  rounds: [{ type: Schema.Types.ObjectId, ref: "Round" }],
});

module.exports = mongoose.model("Player", playerSchema);

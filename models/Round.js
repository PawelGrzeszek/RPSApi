const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roundSchema = new mongoose.Schema({
  firstPlayer: { type: String, required: true },
  secondPlayer: { type: String, required: true, default: "rock" },
  result: { type: String },
});

roundSchema.pre("deleteMany", function (next) {
  let round = this;
  round.model("Player").deleteMany({ rounds: round._id }, next);
});

module.exports = mongoose.model("Round", roundSchema);

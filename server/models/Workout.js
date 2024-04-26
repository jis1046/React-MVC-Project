const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const WorkoutSchema = new mongoose.Schema({
  name:
    {
      type: String,
      required: true,
      trim: true,
      set: setName,
    },

  exercises: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
      },
      sets: {
        type: Number,
        min: 0,
        required: true,
      },
      reps: {
        type: Number,
        min: 0,
        required: true,
      },
      weight: {
        type: String,
        trim: true,
      },
    }],
    default: [],
  },

  /* set: {
    type: Number,
    min: 0,
    required: true,
  },
  reps: {
    type: Number,
    min: 0,
    required: true,
  },
  weight: {
    type: String,
    trim: true,
  }, */
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

WorkoutSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  sets: doc.sets,
  reps: doc.reps,
  weight: doc.weight,
});

const WorkoutModel = mongoose.model('Workout', WorkoutSchema);
module.exports = WorkoutModel;

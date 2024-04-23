const models = require('../models');
const WorkoutModel = require('../models/Workout');

const { Workout } = models;

const makerPage = (req, res) => res.render('app');

const makeWorkout = async (req, res) => {
  if (!req.body.name || !req.body.exerciseName || !req.body.sets || !req.body.reps) {
    return res.status(400).json({ error: 'Name, exercise, sets, and reps are all required!' });
  }

  const workoutData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  const exercise = {
    name: req.body.exerciseName,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
  };

  try {
    const doc = await WorkoutModel.findOneAndUpdate(
      workoutData,
      { $push: { exercises: exercise }},
      { upsert: true, new: true,
      setDefaultsOnInsert: true }
    );
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Workout already exists' });
    }
    return res.status(500).json({ error: 'An error adding exercise!' });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Workout.find(query).select('name exercises').lean().exec();

    return res.json({ workouts: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving workouts!' });
  }
};

module.exports = {
  makerPage,
  makeWorkout,
  getWorkouts,
};

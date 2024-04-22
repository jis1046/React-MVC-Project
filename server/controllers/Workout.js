const models = require('../models');

const { Workout } = models;

const makerPage = (req, res) => res.render('app');

const makeWorkout = async (req, res) => {
  if (!req.body.name || req.body.exercise || !req.body.sets || !req.body.reps) {
    return res.status(400).json({ error: 'Name, exercise, set, and reps are all required!' });
  }

  const workoutData = {
    name: req.body.name,
    exercise: req.body.name,
    sets: req.body.sets,
    reps: req.body.reps,
    weight: req.body.weight,
    owner: req.session.account._id,
  };

  try {
    const newWorkout = new Workout(workoutData);
    await newWorkout.save();
    return res.status(201).json({
      name: newWorkout.name,
      exercise: newWorkout.exercise,
      sets: newWorkout.sets,
      reps: newWorkout.reps,
      weight: newWorkout.weight,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Workout already exists' });
    }
    return res.status(500).json({ error: 'An error occured making workout!' });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Workout.find(query).select('name exercise sets reps weight').lean().exec();

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

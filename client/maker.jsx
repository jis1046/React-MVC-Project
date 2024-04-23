const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleWorkout = (e, onWorkoutAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#workoutName').value;
    const exerciseName = e.target.querySelector('#workoutExercise').value;
    const sets = e.target.querySelector('#workoutSet').value;
    const reps = e.target.querySelector('#workoutReps').value;
    const weight = e.target.querySelector('#workoutWeight').value;

    if(!name || !exerciseName || !sets || !reps) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, exerciseName, sets, reps, weight}, onWorkoutAdded);
    return false;
}

const WorkoutForm = (props) => {
    return(
        <form id="workoutForm"
            onSubmit={(e) => handleWorkout(e, props.triggerReload)}
            name="workoutForm"
            action="/maker"
            method="POST"
            className="workoutForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="workoutName" type="text" name="name" placeholder="Workout Name" />
            <label htmlFor="exercises">Exercise: </label>
            <input id="workoutExercise" type="text" name="exercises" placeholder="Workout Exercise" />
            <label htmlFor="set">Set: </label>
            <input id="workoutSet" type="number" min="0" name="set" />
            <label htmlFor="reps">Reps: </label>
            <input id="workoutReps" type="number" min="0" name="reps"/> 
            <label htmlFor="reps">Weight: </label>
            <input id="workoutWeight" type="text" min="0" name="weight" placeholder="Workout Weight"/> 
            <input className="makeWorkoutSubmit" type="submit" value="Make Workout" />
        </form>
    );
};

const WorkoutList = (props) => {
    const [workouts, setWorkouts] = useState(props.workouts);

    useEffect(() => {
        const loadWorkoutsFromServer = async () => {
            const response = await fetch('/getWorkouts');
            const data = await response.json();
            setWorkouts(data.workouts);
        };
        loadWorkoutsFromServer();
    }, [props.reloadWorkouts]);

    if(workouts.length === 0) {
        return (
            <div className="workoutList">
                <h3 className="emptyWorkout">No Workouts Yet!</h3>
            </div>
        );
    }

    const workoutNodes = workouts.map(workout => {
        console.dir(workout);
        return (
            <div key={workout.id} className="workout">
                <h3 className="workoutName">Workout: {workout.name}</h3>
                {workout.exercises.map( exercise => (

                <div key={exercise.id} className="workoutExercise">
                    <h3 className="workoutName">Exercise: {exercise.name}</h3>                
                    <h3 className="workoutSet">Set: {exercise.sets}</h3>
                    <h3 className="workoutReps">Reps: {exercise.reps}</h3>
                    <h3 className="workoutWeight">Weight: {exercise.weight}</h3>
                </div>
                ))}
                
            </div>
            
        );
    });

    return (
        <div className="workoutList">
            {workoutNodes}
        </div>
    );
};

const App = () => {
    const [reloadWorkouts, setReloadWorkouts] = useState(false);

    return (
        <div>
            <div id="makeWorkout">
                <WorkoutForm triggerReload={() => setReloadWorkouts(!reloadWorkouts)} />
            </div>
            <div id="workouts">
                <WorkoutList workouts={[]} reloadWorkouts={reloadWorkouts} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;
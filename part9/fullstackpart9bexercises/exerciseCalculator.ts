interface ExercisesParameters {
    target: number;
    dailyExerciseTimes: number[];
}

export const parseExerciseArguments = (target: number, dailyExercises: number[]): ExercisesParameters => {
    if (!isNaN(target) && !dailyExercises.some(isNaN)) {
        return {
          target: target,
          dailyExerciseTimes: dailyExercises
        };
      } else {
        throw new Error('Provided values were not numbers!');
      }
};

interface ExerciseResult {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

export const calculateExercises = (target: number, dailyExercisesLogs: number[]): ExerciseResult => {
    const periodLength = dailyExercisesLogs.length;
    const trainingDays = dailyExercisesLogs.filter(n => n !== 0).length;
    const average = (dailyExercisesLogs.reduce((a, b) => a + b, 0)) /(dailyExercisesLogs.length);
    const success = average >= target;

    const rates = (averageExercise: number, targetExercise: number): number => {
       const ratingValue = averageExercise/targetExercise
       if(ratingValue >= 1) {
          return 3;
       } 
       else if(ratingValue >= 0.9) {
        return 2;
       }
       else {
        return 1;
       }
    }

    const descriptions = (rating: number): string => {
        if(rating === 1) {
            return "Need to put more time in exercise";
        }
        else if(rating === 2) {
            return "You are doing average exercise";
        }
        else {
            return "You are doing above the recommended exercise";
        }
    }

    const rating = rates(average, target);

    const ratingDescription = descriptions(rating)

    return {
        periodLength, 
        trainingDays, 
        success,
        rating, 
        ratingDescription,
        target, 
        average
    }
};
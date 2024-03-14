import { POSITION, positionCategory } from 'users/types/position.type';

// random function
/**
 * getRandomInt(3) => expected 0, 1, 2
 *
 */
const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

// get random position
const getRandomPosition = () => {
  const allPositions = [];
  for (const c in POSITION) {
    const positions = POSITION[c as positionCategory];
    allPositions.concat(positions);
  }

  const randomIndex = getRandomInt(allPositions.length);
  return allPositions[randomIndex];
};

export default getRandomPosition;

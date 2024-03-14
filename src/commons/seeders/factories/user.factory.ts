import { User } from 'entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';
import getRandomPosition from 'commons/utils/seeding-position.util';

export default setSeederFactory(User, async (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.name = faker.internet.userName();
  user.password = await bcrypt.hash('1234', 10);
  user.position = getRandomPosition();

  return user;
});

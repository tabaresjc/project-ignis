import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../apps/ignis-api/src/app/modules/user/entities/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.firstName();
  return user;
});

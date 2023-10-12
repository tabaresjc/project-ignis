import { setSeederFactory } from 'typeorm-extension';
import { Phrase } from '../../apps/ignis-api/src/app/modules/phrase/entities/phrase.entity';
import type { Faker } from '@faker-js/faker';

export default setSeederFactory(Phrase, (faker: Faker, meta: any) => {
  const phrase = new Phrase();
  phrase.userID = meta.userIDs.pop();
  return phrase;
});

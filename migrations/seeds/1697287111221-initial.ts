import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../apps/ignis-api/src/app/modules/user/entities/user.entity';
import { Phrase } from '../../apps/ignis-api/src/app/modules/phrase/entities/phrase.entity';

export default class Initial1697287111221 implements Seeder {
  track = true;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const maxItems = 100;
    const userFactory = await factoryManager.get(User);
    await userFactory.saveMany(maxItems);

    const phraseFactory = await factoryManager.get(Phrase);
    const userIDs = Array.from({ length: maxItems }, (v, k) => maxItems - k);
    phraseFactory.setMeta({ userIDs });
    await phraseFactory.saveMany(maxItems);
  }
}

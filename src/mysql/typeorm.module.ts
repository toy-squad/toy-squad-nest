import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TYPEORM_EX_REPO } from './typeorm-ex.decorator';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({ providers: [] })
export class TypeOrmModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_EX_REPO, repository);
      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmModule,
      providers,
    };
  }
}

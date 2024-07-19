import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: number;
}

/**
 * Base Abstract Repository
 * @param {T} t - Entity Template
 * @description This is the BaseAbstractRepository including the Repository Methods
 */
export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entitty: Repository<T>) {
    this.entity = entitty;
  }

  /**
   * Save Method
   */
  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  /**
   * Save Many Method
   */
  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  /**
   * Create Method
   */
  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  /**
   * Create Many methd
   */
  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  /**
   * FindOneByID method
   */
  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  /**
   * FindByCondition Method
   */
  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  /**
   * FindWithRelation Method
   */
  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  /**
   * FindAll Method
   */
  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  /**
   * Remove Method
   */
  public async remove(data: T): Promise<T> {
    return this.entity.remove(data);
  }

  /**
   * Preload Method
   */
  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}

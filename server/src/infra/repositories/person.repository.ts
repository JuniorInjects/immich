import { AssetFaceId, EmbeddingSearch, IPersonRepository, PersonSearchOptions, UpdateFacesData } from '@app/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AssetEntity, AssetFaceEntity, PersonEntity } from '../entities';
import { asVector } from '../infra.utils.ts';

export class PersonRepository implements IPersonRepository {
  constructor(
    @InjectRepository(AssetEntity) private assetRepository: Repository<AssetEntity>,
    @InjectRepository(PersonEntity) private personRepository: Repository<PersonEntity>,
    @InjectRepository(AssetFaceEntity) private assetFaceRepository: Repository<AssetFaceEntity>,
  ) {}

  /**
   * Before reassigning faces, delete potential key violations
   */
  async prepareReassignFaces({ oldPersonId, newPersonId }: UpdateFacesData): Promise<string[]> {
    const results = await this.assetFaceRepository
      .createQueryBuilder('face')
      .select('face."assetId"')
      .where(`face."personId" IN (:...ids)`, { ids: [oldPersonId, newPersonId] })
      .groupBy('face."assetId"')
      .having('COUNT(face."personId") > 1')
      .getRawMany();

    const assetIds = results.map(({ assetId }) => assetId);

    await this.assetFaceRepository.delete({ personId: oldPersonId, assetId: In(assetIds) });

    return assetIds;
  }

  async reassignFaces({ oldPersonId, newPersonId }: UpdateFacesData): Promise<number> {
    const result = await this.assetFaceRepository
      .createQueryBuilder()
      .update()
      .set({ personId: newPersonId })
      .where({ personId: oldPersonId })
      .execute();

    return result.affected ?? 0;
  }

  delete(entity: PersonEntity): Promise<PersonEntity | null> {
    return this.personRepository.remove(entity);
  }

  async deleteAll(): Promise<number> {
    const people = await this.personRepository.find();
    await this.personRepository.remove(people);
    return people.length;
  }

  getAllFaces(): Promise<AssetFaceEntity[]> {
    return this.assetFaceRepository.find({ relations: { asset: true }, withDeleted: true });
  }

  getAll(): Promise<PersonEntity[]> {
    return this.personRepository.find();
  }

  getAllWithoutThumbnail(): Promise<PersonEntity[]> {
    return this.personRepository.findBy({ thumbnailPath: '' });
  }

  getAllForUser(userId: string, options?: PersonSearchOptions): Promise<PersonEntity[]> {
    const queryBuilder = this.personRepository
      .createQueryBuilder('person')
      .leftJoin('person.faces', 'face')
      .where('person.ownerId = :userId', { userId })
      .innerJoin('face.asset', 'asset')
      .orderBy('person.isHidden', 'ASC')
      .addOrderBy("NULLIF(person.name, '') IS NULL", 'ASC')
      .addOrderBy('COUNT(face.assetId)', 'DESC')
      .addOrderBy("NULLIF(person.name, '')", 'ASC', 'NULLS LAST')
      .having('COUNT(face.assetId) >= :faces', { faces: options?.minimumFaceCount || 1 })
      .groupBy('person.id')
      .limit(500);
    if (!options?.withHidden) {
      queryBuilder.andWhere('person.isHidden = false');
    }

    return queryBuilder.getMany();
  }

  getAllWithoutFaces(): Promise<PersonEntity[]> {
    return this.personRepository
      .createQueryBuilder('person')
      .leftJoin('person.faces', 'face')
      .having('COUNT(face.assetId) = 0')
      .groupBy('person.id')
      .withDeleted()
      .getMany();
  }

  getById(personId: string): Promise<PersonEntity | null> {
    return this.personRepository.findOne({ where: { id: personId } });
  }

  getByName(userId: string, personName: string): Promise<PersonEntity[]> {
    return this.personRepository
      .createQueryBuilder('person')
      .leftJoin('person.faces', 'face')
      .where('person.ownerId = :userId', { userId })
      .andWhere('LOWER(person.name) LIKE :name', { name: `${personName.toLowerCase()}%` })
      .limit(20)
      .getMany();
  }

  getAssets(personId: string): Promise<AssetEntity[]> {
    return this.assetRepository.find({
      where: {
        faces: {
          personId,
        },
        isVisible: true,
        isArchived: false,
      },
      relations: {
        faces: {
          person: true,
        },
        exifInfo: true,
      },
      order: {
        fileCreatedAt: 'desc',
      },
      // TODO: remove after either (1) pagination or (2) time bucket is implemented for this query
      take: 1000,
    });
  }

  create(entity: Partial<PersonEntity>): Promise<PersonEntity> {
    return this.personRepository.save(entity);
  }

  async createFace(entity: AssetFaceEntity): Promise<AssetFaceEntity> {
    const { embedding, ...face } = entity;
    await this.assetFaceRepository.save(face);
    await this.assetFaceRepository.manager.query(
      `UPDATE "asset_faces" SET "embedding" = ${asVector(embedding)} WHERE "assetId" = $1 AND "personId" = $2`,
      [entity.assetId, entity.personId],
    );
    return this.assetFaceRepository.findOneByOrFail({ assetId: entity.assetId, personId: entity.personId });
  }

  async update(entity: Partial<PersonEntity>): Promise<PersonEntity> {
    const { id } = await this.personRepository.save(entity);
    return this.personRepository.findOneByOrFail({ id });
  }

  async getFacesByIds(ids: AssetFaceId[]): Promise<AssetFaceEntity[]> {
    return this.assetFaceRepository.find({ where: ids, relations: { asset: true }, withDeleted: true });
  }

  async getRandomFace(personId: string): Promise<AssetFaceEntity | null> {
    return this.assetFaceRepository.findOneBy({ personId });
  }

  searchByEmbedding({ ownerId, embedding, numResults, maxDistance }: EmbeddingSearch): Promise<AssetFaceEntity[]> {
    let query = this.assetFaceRepository
      .createQueryBuilder('faces')
      .leftJoinAndSelect('faces.asset', 'asset')
      .where('asset.ownerId = :ownerId', { ownerId })
      .orderBy(`faces.embedding <=> ${asVector(embedding)}`)
      .limit(numResults);

    if (maxDistance) {
      query = query.andWhere(`(faces.embedding <=> ${asVector(embedding)}) <= :maxDistance`, { maxDistance });
    }

    return query.getMany();
  }
}

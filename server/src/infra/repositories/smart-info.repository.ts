import { EmbeddingSearch, ISmartInfoRepository } from '@app/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetEntity, SmartInfoEntity } from '../entities';
import { asVector } from '../infra.utils.ts';

@Injectable()
export class SmartInfoRepository implements ISmartInfoRepository {
  constructor(@InjectRepository(SmartInfoEntity) private repository: Repository<SmartInfoEntity>) {}

  async searchByEmbedding({ ownerId, embedding, numResults }: EmbeddingSearch): Promise<AssetEntity[]> {
    const results = await this.repository
      .createQueryBuilder('smartInfo')
      .leftJoinAndSelect('smartInfo.asset', 'asset')
      .where('asset.ownerId = :ownerId', { ownerId })
      .orderBy(`smartInfo.clipEmbedding <=> ${asVector(embedding)}`)
      .limit(numResults)
      .getMany();

    return results.map((result) => result.asset).filter((asset): asset is AssetEntity => !!asset);
  }

  async upsert(info: Partial<SmartInfoEntity>): Promise<void> {
    const { clipEmbedding, ...withoutEmbedding } = info;
    await this.repository.upsert(withoutEmbedding, { conflictPaths: ['assetId'] });
    if (clipEmbedding) {
      await this.repository.manager.query(
        `UPDATE "smart_info" SET "clipEmbedding" = ${asVector(clipEmbedding)} WHERE "assetId" = $1`,
        [info.assetId],
      );
    }
  }
}

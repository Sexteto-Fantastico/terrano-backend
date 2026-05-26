import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import { SystemLog } from "../entities/system-log.entity";
import { getRequestContext } from "../../utils/request-context";

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    await this.save(event, "CREATE");
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.save(event, "UPDATE");
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.save(event, "DELETE");
  }

  private async save(event: any, action: string) {
    if (event.metadata.tableName === "system_log") return;

    const entity = event.entity || event.databaseEntity;
    if (!entity) return;

    const { userId } = getRequestContext();

    await event.manager.getRepository(SystemLog).save({
      entity_name: event.metadata.tableName,
      entity_id: entity.id,
      action,
      user_id: userId,
    });
  }
}

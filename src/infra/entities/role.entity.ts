import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Policy } from "./policy.entity";
import { User } from "./user.entity";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export interface IRole extends ITerranoBaseEntity {
  name: string;
  description?: string;
  policies: Policy[];
  users?: User[];
  updated_by?: number;
}

@Entity("role")
export class Role extends TerranoBaseEntity implements IRole {
  @Column({ type: "varchar", length: 50, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToMany(() => Policy)
  @JoinTable({
    name: "role_policies",
    joinColumn: { name: "role_id" },
    inverseJoinColumn: { name: "policy_id" },
  })
  policies: Policy[];

  @OneToMany(() => User, (user) => user.role)
  users?: User[];

  constructor(role: IRole) {
    super(role);
    Object.assign(this, role);
  }
}

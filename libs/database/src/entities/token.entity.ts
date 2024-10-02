import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Token {

  @Column()
  @PrimaryColumn()
  token: string;
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  exp: Date | string;
  @Column()
  userId: string;


}
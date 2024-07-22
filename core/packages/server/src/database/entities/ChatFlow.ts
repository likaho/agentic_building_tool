/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { ChatflowType, IChatFlow } from '../../Interface'

@Entity()
export class ChatFlow implements IChatFlow {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ type: 'text' })
    flowData: string

    @Column({ nullable: true })
    deployed?: boolean

    @Column({ nullable: true })
    isPublic?: boolean

    @Column({ nullable: true })
    apikeyid?: string

    @Column({ nullable: true, type: 'text' })
    chatbotConfig?: string

    @Column({ nullable: true, type: 'text' })
    apiConfig?: string

    @Column({ nullable: true, type: 'text' })
    analytic?: string

    @Column({ nullable: true, type: 'text' })
    speechToText?: string

    @Column({ nullable: true, type: 'text' })
    category?: string

    @Column({ nullable: true, type: 'text' })
    type?: ChatflowType

    @Column({ nullable: true, type: 'varchar' })
    ownerAddress?: string

    @Column({ nullable: true, type: 'varchar' })
    tokenId?: string

    @Column({ nullable: true, type: 'varchar' })
    nftAddress?: string    

    @Column({ nullable: true })
    isPublished?: boolean

    @Column({ nullable: true, type: 'integer' })
    usageCount?: number

    @Column({ nullable: true, type: 'integer'  })
    gas?: number

    @Column({ nullable: true, type: 'text' })
    description?: string

    @Column({ type: 'timestamp' })
    @CreateDateColumn()
    createdDate: Date

    @Column({ type: 'timestamp' })
    @UpdateDateColumn()
    updatedDate: Date
}

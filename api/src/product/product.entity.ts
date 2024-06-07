import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

//(código, nombre, cantidad, precio)

@Entity('public.product')
export class Product {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({ name: 'codigo' })
	code: string

	@Column({ name: 'nombre' })
	name: string

	@Column({ name: 'cantidad' })
	stock: number

	@Column({ name: 'precio' })
	price: number
}

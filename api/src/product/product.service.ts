import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'


@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private productRepo: Repository<Product>) {

  }


  getHello(): string {
    return 'Hello World!';
  }


  transform(rawProduct: any): { success: boolean, product?: Product, errors?: string[] } {
    const errors = []
    if (!rawProduct.Codigo || rawProduct.Codigo.trim() === '') errors.push('missing code')
    if (!rawProduct.Nombre || rawProduct.Nombre.trim() === '') errors.push('missing name')
    const price = Number(rawProduct.Precio)

    if (Number.isNaN(price)) errors.push('missing or invalid price')
    const stock = Number(rawProduct.Cantidad)

    if (Number.isNaN(stock)) errors.push('missing or invalid stock')

    if (errors.length !== 0) return { success: false, errors }
    const product: Product = { code: rawProduct.Codigo.trim(), name: rawProduct.Nombre.trim(), price, stock }
    return { success: true, product }


  }

  validateDuplicates(products: Product[]):{uniques:Product[],duplicates:Product[]} {
    const productMap = {}
    const duplicates = []

    for (const product of products) {
      if (productMap[product.code]) {
        duplicates.push(product)
        productMap[product.code].stock+=product.stock
        continue
      }

      productMap[product.code] = product
    }

    return { duplicates, uniques:Object.values(productMap) }


  }


  save(products: Product[]) {
    return this.productRepo.insert(products)
  }

}

import { Body, Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { xlsxToJson } from '../utils/xlsx';
import { randomUUID } from 'crypto';

const batchs = {}

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  getHello(): string {
    return this.productService.getHello();
  }
  @Get('batchStatus/:uid')
  getBathcStatus(@Param('uid') batchUid:string): string {
    return batchs[batchUid]
  }



  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(new ParseFilePipe({
    // validators: [new FileTypeValidator({ fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
  })) file: Express.Multer.File, @Body() body: any) {
    console.log({ file });

    const batchUid = randomUUID()
    batchs[batchUid] = { status: 'loading', data: {} }
    const batchCallback = async () => {

      const filepath = join('files', file.originalname)

      await writeFile(filepath, file.buffer)
      const rawProducts = xlsxToJson(filepath)
console.log({rawProducts});

      const products = []
      const fileErrors = []
      let totalPrice = 0
      let totalStock = 0

      rawProducts.forEach((rawProduct, index) => {
        const { success, product, errors } = this.productService.transform(rawProduct)
        if (success) products.push(product)
        else fileErrors.push({ row: index + 2, errors })
      })

      const { duplicates, uniques } = this.productService.validateDuplicates(products)

      uniques.forEach(p => {
        totalPrice += p.price
        totalStock += p.stock
      })


      await this.productService.save(uniques)

      batchs[batchUid].data = { duplicates, uniques, fileErrors, totalPrice, totalStock, totalProducts: uniques.length }
      batchs[batchUid].status = 'finished'
    }

    batchCallback()

    return {message:'Se estan cargando los datos',batchUid}



  }
}
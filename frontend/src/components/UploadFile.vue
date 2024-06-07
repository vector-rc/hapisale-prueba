<script setup lang="ts">
import { ref } from 'vue'

interface Product {
  id: number,
  code: string,
  name: string,
  price: number,
  stock: number
}

const apiUrl='http://localhost:3000'

const file = ref<File | null>()
const products = ref<Product[]>([])
const duplicates = ref<Product[]>([])
const fileErrros = ref<{ row: number, errors: string[] }[]>([])
const loadingStatus = ref('iddle')
const loadingError = ref('')


const uploadFile = async () => {
  try {
    loadingStatus.value = 'loading'
    if (!file.value) {
      loadingError.value = 'No ha elegido ningun archivo'
      loadingStatus.value = 'error'

    }

    const data = new FormData()
    data.append('file', file.value)
    const res = await fetch(`${apiUrl}/product/uploadFile`, { method: 'POST', body: data })
    if (!res.ok) {
      loadingStatus.value = 'error'

      return
    }

    const resData = await res.json()
    const batchUid = resData.batchUid
    loadingStatus.value = 'loading'


    const interval = setInterval(async () => {
      const res = await fetch(`${apiUrl}/product/batchStatus/${batchUid}`)
      const { data, status } = await res.json()
      if (status === 'loading') return
      products.value = data.uniques
      duplicates.value = data.duplicates
      fileErrros.value = data.fileErrors
      loadingStatus.value = 'loaded'

      clearInterval(interval)
    }, 3000)
  } catch (error) {
    loadingStatus.value = 'error'
    loadingError.value = 'Error al cargar el archivo'
  }



}

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    file.value = target.files[0];
    loadingError.value = ''

  }
}
</script>

<template>
  <main>
    <input type="file" @change="onFileChanged($event)" name="products" id="">
    <button :disabled="loadingStatus === 'loading'" @:click="uploadFile" type="button">Cargar archivo</button>
    <span v-if="loadingStatus === 'loading'">Cargando el archivo</span>
    <span v-if="loadingStatus === 'error'" class="error">{{ loadingError }}</span>
    <div v-if="loadingStatus === 'loaded'">
      <h3>Productos cargados: {{ products?.length }}</h3>
      <table>
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="product in products">
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
          </tr>
        </tbody>


      </table>
      <br>
      <h3>Productos duplicados: {{ duplicates?.length }}</h3>
      <table>
        <thead>

          <tr>
            <th>Codigo</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in duplicates">
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
          </tr>
        </tbody>

      </table>
      <h3>Errores en {{ fileErrros?.length }} filas</h3>
      <table>
        <thead>
          <tr>
            <th>Fila</th>
            <th>Errores</th>
          </tr>

        </thead>
        <tbody>
          <tr v-for="err in fileErrros">
            <td>{{ err.row }}</td>
            <td>{{ err.errors.join(', ') }}</td>
          </tr>
        </tbody>


      </table>

    </div>
  </main>


</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem
}

.error {
  color: red;
}


table {
  border-collapse: collapse;
  font-family: Tahoma, Geneva, sans-serif;
}

table td {
  padding: 10px;
}

table thead th {
  color: #ffffff;
  border: 1px solid #494949;
}

table tbody td {
  color: #dfdfdf;
  border: 1px solid #424242;
}

table tbody tr {
  background-color: transparent;
}

table tbody tr:nth-child(odd) {
  background-color: #ffffff11;
}
</style>

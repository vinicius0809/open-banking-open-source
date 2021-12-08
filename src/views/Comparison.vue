<template>
  <div class="comparison">
    <h1>Comparar dados de crédito entre participantes</h1>
    <Comparison/>
  </div>
</template>
<script>
import Comparison from '@/components/Comparison/Comparison.vue'
export default {
  name: 'Home',
  components: {
    Comparison
  }
}
</script>

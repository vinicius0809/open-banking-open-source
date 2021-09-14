<template>
  <div class="home">
    <h1>Lista de participantes Open Banking</h1>
    <ListParticipants/>
  </div>
</template>

<script>
// @ is an alias to /src
import ListParticipants from '@/components/ListParticipants.vue'

export default {
  name: 'Home',
  components: {
    ListParticipants
  }
}
</script>

<template>
  <v-container>
   <v-layout>
    <v-flex xs12 pb-2>
      <input type="file" ref="fileInput" 
        id="file" @change="processFile($event)">
    </v-flex>
   </v-layout>
   <v-layout xs12 pb-3>
    <v-flex>
      <v-btn color="primary" @click="uploadFile">Enviar</v-btn>
    </v-flex>
   </v-layout>
   <v-divider></v-divider>
   <v-layout row wrap align-center>
      <v-flex xs12>
          <v-container fluid class="pl-0 pr-0">
            <v-layout row wrap>
              <v-flex xs12 sm6 lg3 v-for="image in images" v-bind:key="image.id">

                <v-card>
                  <v-img class="white--text" height="200px" :src="image.url">
                  </v-img>
                  <v-card-title>
                    <div>
                      <span class="grey--text"> {{ image.name }}</span>
                      <v-chip :color="selectClass(image.scorePromedio)"> {{ image.scorePromedio | trimScore }}</v-chip>
                        <br/>
                        <span>{{ image.labels | separateLabels }}</span>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn text @click="goToImageDetail(image.id)">Explore </v-btn>
                  </v-card-actions>
                </v-card>

              </v-flex>
            </v-layout>
          </v-container>
      </v-flex>
   </v-layout>
  </v-container>
</template>

<script>
import { firestore } from '@/main'
import { storage } from '@/main'
import axios from 'axios'
  export default {
    name: 'Home',
    data: () => ({
      apiKey: 'AIzaSyBCiqHJ2d2FacYoxuP-ruFmBGg5jYpMzhU',
      file: '',
      images: []
    }),
    methods: {
      processFile: function(event){
        this.file = event.target.files[0]
      },
      uploadFile: function(){
        let name = (new Date()) + '-' + this.file.name
        let metadata = { contentType: this.file.type}
        storage.child(name).put(this.file, metadata)
        .then(snapshot=>snapshot.ref.getDownloadURL())
        .then( url => {
          const input = this.$refs.fileInput
          input.type = 'text'
          input.type = 'file'
          const info = {
            "requests" : [{
              "features": [{
                "type": "LABEL_DETECTION"
              }],
              "image": {
                "source": {
                  "imageUri": url
                }
              }
            }]
          }

          axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`, info)
          .then(response => {
              const labels = []
              let sliceLabelArray = response.data.responses[0].labelAnnotations.slice(0,3)
              sliceLabelArray.forEach(function(label){
                labels.push(label.description)
              })

            let image = {
              url: url,
              name: name,
              createdAt: (new Date()),
              labels: labels,
              scorePromedio: 0
            }
          firestore.collection('images').add(image)
          })
        })
      },
      goToImageDetail: function(id) {
        this.$router.push({ path: `/image/${id}`})
      },
      selectClass: function(score){
        if (score < -0.25) {
          return 'red'
        } else if (score >= -0.25 && score < 0.25){
          return 'warning'
        } else{
          return 'success'
        }
      }
    },
    firestore() {
      return {
        images: firestore.collection('images')
      }
    },
    filters: {
      separateLabels: function(value){
        return `${value[0]}, ${value[1]}, ${value[2]}`
      },
      trimScore: function(value){
        return Number(value.toString().slice(0,5))
      }
    }
  }
</script>

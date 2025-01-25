import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    loading:false
  },
  getters: {
    loading: (ctx => ctx.loading)
  },
  mutations: {
    setLoading(state, value){
        state.loading = value
    }
  },
  actions: {
        upload(ctx, data) {            
            return new Promise((resolve, reject) => {
                const filename = data.filename || 'image';
                ctx.commit("setLoading", true)
                ctx.dispatch("getImageFile", {image:data.image, filename}).then( (image) => {
                    data.image = image;
                    const formData = new FormData();

                    formData.append("resource", data.resource)
                    formData.append("column", data.column || null)
                    formData.append("image", image);

                    axios
                        .post(`app/images/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                        .then((r) => resolve(r))
                        .catch(error => reject(error))
                        .finally( () => ctx.commit("setLoading", false))
                })
            })
        },
        getImageFile(ctx, data){
            return new Promise((resolve) => {
                fetch(data.image.webPath).then(response => {
                    return response.blob().then(blob => {
                        return blob.arrayBuffer().then(buf => {
                            return new File([buf], data.filename, {type:'image/' + data.image.format});
                        })
                    })
                }).then( image => resolve(image))
            })
        }
    },
}

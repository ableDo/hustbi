Component({
  data: {
    imagePath: '',
    uploadProgress: 0,
  },
  
  methods: {
    onRequestUploadImage: function () {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          this.setData({
            imagePath: res.tempFilePaths[0],
          })
          let p = 0
          setInterval(() => {
            p += 20;
            p = p > 100 ? 100 : p
            this.setData({
              uploadProgress: p,
            })
          }, 2000)
        },
      })
    },
  },
})
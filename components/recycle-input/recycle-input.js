// components/recycle-input/recycle-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    placeholder: String,
    id: String,
    _style: String,
    _type: String,
    _maxlength: String,
    _value: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputFocus: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInputFocus: function () {
      this.setData({
        inputFocus: true,
      })
    },
    onInputBlur: function () {
      this.setData({
        inputFocus: false,
      })
    },
    onInput: function (e) {
      this.triggerEvent('myinput', {...e.detail, id: this.id})
    },
  },
})

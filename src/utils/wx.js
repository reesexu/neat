export const showToast = (title, options) => {
  wx.showToast({
    title,
    icon: 'none',
    ...options
  })
}
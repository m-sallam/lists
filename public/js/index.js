$(document).ready(function () {
  $('.sidenav').sidenav()
  $('.dropdown-trigger').dropdown()
  $('select').formSelect()
  $('body').niceScroll()
  $('.submit').on('click', function (e) {
    $(this).addClass('disabled')
  })
})

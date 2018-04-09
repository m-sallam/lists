var M
$('.removeItem').on('click', function (e) {
  if (!window.confirm('Remove item?')) return
  $(e.currentTarget).html(`<div class="preloader-wrapper small active">
                          <div class="spinner-layer spinner-blue-only">
                            <div class="circle-clipper left">
                              <div class="circle"></div>
                            </div><div class="gap-patch">
                              <div class="circle"></div>
                            </div><div class="circle-clipper right">
                              <div class="circle"></div>
                            </div>
                          </div>
                        </div>`)
  $(e.currentTarget).addClass('disabled')
  $(e.currentTarget).css({ 'padding-top': '10px' })
  let info = $(e.currentTarget).attr('id')
  $.ajax({
    url: `/api`,
    type: 'delete',
    data: { itemInfo: info, listId: $('#listId').val() },
    error: function (xhr, status, error) {
      console.log(error)
    },
    success: function (result, status, xhr) {
      if (result.status !== 'ok') {
        M.toast({ html: `${result.error}` })
        $(e.currentTarget).html('<i class="material-icons">remove</i>')
        $(e.currentTarget).css({ 'padding-top': '0px' })
        $(e.currentTarget).removeClass('disabled')
      } else {
        $(e.currentTarget).closest('center').remove()
        M.toast({ html: `Item Removed` })
      }
    }
  })
})

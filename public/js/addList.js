var M
$('.addItem').on('click', function (e) {
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
  $.ajax({
    url: `/collection/${$('#collectionId').val()}/add`,
    type: 'POST',
    data: { listId: $(e.currentTarget).attr('id') },
    error: function (xhr, status, error) {
      console.log(error)
    },
    success: function (result, status, xhr) {
      if (result.status !== 'ok') {
        M.toast({ html: `${result.error}` })
        $(e.currentTarget).html('<i class="material-icons">add</i>')
        $(e.currentTarget).css({ 'padding-top': '0px' })
        $(e.currentTarget).removeClass('disabled')
      } else {
        $(e.currentTarget).html('<i class="material-icons">check</i>')
        $(e.currentTarget).css({ 'padding-top': '0px' })
        M.toast({ html: `List Added` })
      }
    }
  })
})

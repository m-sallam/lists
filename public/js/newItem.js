var xhr = null
var M
var searchResults = []
$('#closeIcon').on('click', function () {
  $('#searchBar').val('')
  if (xhr != null) {
    xhr.abort()
    xhr = null
  }
  $('#results').html('')
})
$('#searchBar').on('input', (e) => {
  let query = e.currentTarget.value
  let listType = $('#listType').val()
  if (query.length < 2) {
    if (xhr != null) {
      xhr.abort()
      xhr = null
    }
    $('#results').html('')
    return
  }
  if (xhr != null) {
    xhr.abort()
    xhr = null
  }
  $('#results').html(`<center><div class="preloader-wrapper big active">
                      <div class="spinner-layer spinner-blue-only">
                        <div class="circle-clipper left">
                          <div class="circle"></div>
                        </div><div class="gap-patch">
                          <div class="circle"></div>
                        </div><div class="circle-clipper right">
                          <div class="circle"></div>
                        </div>
                      </div></center> `)
  xhr = $.ajax({
    url: `/api/search/${listType}/${query}`,
    type: 'GET',
    error: function (xhr, status, error) {
      console.log(error)
    },
    success: function (result, status, xhr) {
      if (result.status === 'API error') {
        $('#results').html('<p class="">There is an error with API :/</p>')
        return
      }
      if (result.result !== []) {
        let html = ''
        searchResults = result.result
        for (let item of result.result) {
          html += `<center>
                    <div class="col s12 m6 l4">
                      <div class="card" >
                        <div class="card-image">
                          <img src="${item.picture}" style="height:300px;">
                          <a id="${result.result.indexOf(item)}" class="addItem btn-floating halfway-fab waves-effect btn-large waves-light red"><i class="material-icons">add</i></a>
                        </div>
                        <div class="card-content">
                          <span class="card-title activator grey-text text-darken-4">${item.name.length < 16 ? item.name : item.name.substring(0, 16) + '..'}<i class="material-icons right">more_vert</i></span>
                          <p><a target="_blank" href="${item.info}">More Info </a></p>
                        </div>
                        <div class="card-reveal">
                          <i class="material-icons right card-title grey-text text-darken-4">close</i>
                          <span class="card-title grey-text text-darken-4">${item.name}</span>
                        </div>
                      </div>
                    </div>
                  </center>`
        }
        $('#results').html(html)
        $('body').getNiceScroll().resize()
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
          let index = $(e.currentTarget).attr('id')
          $.ajax({
            url: `/api/add`,
            type: 'POST',
            data: { item: searchResults[index], listId: $('#listId').val() },
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
                M.toast({ html: `Item Added` })
              }
            }
          })
        })
      } else {
        $('#results').html('<center><p class="">No Items found :/</p></center>')
      }
    }
  })
})

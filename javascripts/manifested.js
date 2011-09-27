(function() {
  $(function() {
    var assemble, bind_enter_key, fetch_site, handle_fetch_request, is_valid_url, load_copy_button;
    assemble = function(data) {
      var images_str, javascripts_str, output, stylesheets_str;
      console.log(data);
      images_str = data.images.join('\n');
      javascripts_str = data.javascripts.join('\n');
      stylesheets_str = data.stylesheets.join('\n');
      output = "CACHE MANIFEST\n# rev 1\n\nNETWORK:\n# resources you never want cached go here\n\nCACHE:\n# images\n" + images_str + "\n\n# javascripts\n" + javascripts_str + "\n\n# stylesheets\n" + stylesheets_str;
      $('#manifest-output').html(output);
      $('#manifest-output').slideDown();
    };
    is_valid_url = function(str) {
      var v;
      v = new RegExp();
      v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
      return v.test(str);
    };
    handle_fetch_request = function(event) {
      var input;
      $('#manifest-output').empty();
      $('.output-container').fadeIn('slow');
      $('.spinner').fadeIn('slow');
      input = $('#site-input').val();
      if (input.indexOf('http://') !== 0 && input.indexOf('https://') !== 0) {
        input = "http://" + input;
      }
      if (is_valid_url(input)) {
        fetch_site(input);
      } else {
        console.log('bad input', input);
      }
    };
    fetch_site = function(url) {
      return $.ajax({
        url: '/cgi-bin/fetch.py',
        dataType: 'json',
        data: {
          site: url
        },
        success: assemble,
        error: function(jqXHR, textStatus, errorThrown) {
          return console.log(jqXHR, textStatus);
        },
        complete: function(jqXHR, textStatus) {
          return $('.spinner').hide();
        }
      });
    };
    bind_enter_key = function() {
      return $('#site-input').keypress(function(event) {
        if (event.keyCode && event.keyCode === 13) {
          handle_fetch_request();
          return false;
        }
        return true;
      });
    };
    load_copy_button = function() {
      var clip;
      clip = new ZeroClipboard.Client();
      clip.setHandCursor(true);
      clip.setText('Copy me!');
      return clip.glue('d_clip_button', 'd_clip_container');
    };
    $('#fetch-button').click(handle_fetch_request);
    $('.output-container').hide();
    $('#manifest-output').hide();
    bind_enter_key();
    return $('#site-input').focus();
  });
}).call(this);

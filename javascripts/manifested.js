(function() {
  $(function() {
    var assemble, bind_enter_key, fetch_site, handle_fetch_request, is_valid_url, load_copy_button, show_error;
    assemble = function(data) {
      var images_str, javascripts_str, output, stylesheets_str;
      console.log(data);
      images_str = data.images.join('\n');
      javascripts_str = data.javascripts.join('\n');
      stylesheets_str = data.stylesheets.join('\n');
      output = "CACHE MANIFEST\n# rev 1\n\nNETWORK:\n# resources you never want cached go here\n\nCACHE:\n# images\n" + images_str + "\n\n# JavaScripts\n" + javascripts_str + "\n\n# stylesheets\n" + stylesheets_str;
      $('.error-container').hide();
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
        show_error("Sorry, I don't understand what '" + input + "' is. Please input a valid domain name.");
      }
    };
    fetch_site = function(url) {
      return $.ajax({
        url: '/cgi-bin/fetch.py',
        data: {
          site: url
        },
        success: assemble,
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus);
          return show_error("Ouch. Something is really wrong. Try again later.");
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
    show_error = function(error) {
      var error_container;
      console.log('got an error', error);
      $('.output-container').fadeIn('slow');
      $('.spinner').hide();
      error_container = $('.error-container');
      error_container.show();
      return error_container.html(error);
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

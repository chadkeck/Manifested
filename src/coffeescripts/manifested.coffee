$ ->
    assemble = ( data ) ->
        console.log( data )

        images_str = data.images.join( '\n' )
        javascripts_str = data.javascripts.join( '\n' )
        stylesheets_str = data.stylesheets.join( '\n' )

        output = """
        CACHE MANIFEST
        # rev 1
        
        NETWORK:
        # resources you never want cached go here
        
        CACHE:
        # images
        #{images_str}
        
        # javascripts
        #{javascripts_str}
        
        # stylesheets
        #{stylesheets_str}
        """

        #console.log( 'output', output )

        $( '#manifest-output' ).html( output )
        $( '#manifest-output' ).slideDown()
        return

    is_valid_url = (str) ->
        v = new RegExp()
        v.compile( "^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$" )
        return v.test(str)

    handle_fetch_request = (event) ->
        $( '#manifest-output' ).empty()
        $( '.output-container' ).fadeIn( 'slow' )
        $( '.spinner' ).fadeIn( 'slow' )

        input = $( '#site-input' ).val()
        if input.indexOf( 'http://' ) isnt 0 and input.indexOf( 'https://' ) isnt 0
            input = "http://" + input

        if is_valid_url( input )
            fetch_site( input )
        else
            console.log( 'bad input', input )
        return

    fetch_site = (url) ->
        $.ajax {
            url: '/cgi-bin/fetch.py'
            dataType: 'json'
            data: {
                site: url
            }
            success: assemble
            error: (jqXHR, textStatus, errorThrown) ->
                console.log( jqXHR, textStatus )
            complete: (jqXHR, textStatus) ->
                $( '.spinner' ).hide()
        }

    bind_enter_key = ->
        $( '#site-input' ).keypress(
            (event) ->
                if event.keyCode and event.keyCode is 13
                    handle_fetch_request()
                    return false
                return true
        )

    load_copy_button = ->
        clip = new ZeroClipboard.Client()
        clip.setHandCursor( true )
        clip.setText( 'Copy me!' )
        clip.glue( 'd_clip_button', 'd_clip_container' )

    $( '#fetch-button' ).click( handle_fetch_request )

    $( '.output-container' ).hide()
    $( '#manifest-output' ).hide()
    
    bind_enter_key()
    $( '#site-input' ).focus()

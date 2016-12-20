'use strict';

angular
    .module('stackTrace', [])
    .factory('StackTraceService', StackTraceService)
    .factory('ErrorLogService', ErrorLogService)
    .provider('$exceptionHandler', ExceptionHandler);


function StackTraceService(){
  return({
      print: printStackTrace
  });
}

function ExceptionHandler(){
  $get: function( errorLogService ) {
      return( errorLogService );

  }
}



function ErrorLogService($log, $window, StackTraceService, ENV, $cookies){
    function log( exception, cause ) {

      $log.error.apply( $log, arguments );

      try {

        var errorMessage = exception.toString();
        var stackTrace = StackTraceService.print({ e: exception });

        $.ajax({
          type: 'POST',
          url: ENV.logUrl,
          contentType: 'application/json',
          headers: {
            'X-Authorization' : $cookies.get('_token')
          },
          data: angular.toJson({
            errorUrl: $window.location.href,
            errorMessage: errorMessage,
            stackTrace: stackTrace,
            cause: ( cause || '' )
          })
        });

      } catch ( loggingError ) {

        $log.warn( 'Error logging failed' );
        $log.log( loggingError );

      }

    }

    return( log );
}










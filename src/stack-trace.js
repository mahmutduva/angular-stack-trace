'use strict'

angular
    .module('stackTrace', [])
    .factory('StackTraceService', StackTraceService)
    .factory('ErrorLogService', ErrorLogService)
    .provider('$exceptionHandler', {
      $get: function (ErrorLogService) {
        return ErrorLogService
      }
    })

function StackTraceService () {
  return ({
    print: printStackTrace
  })
}

function ErrorLogService ($log, $window, StackTraceService, ENV, $cookies) {
  function log (exception, cause) {
    $log.error.apply($log, arguments)

    try {
      var errorMessage = exception.toString()
      var stackTrace = StackTraceService.print({ e: exception })
      var stackTraceUrl = ENV.apiCockpit.concat(ENV.stackTracePath || '/frontend/log')

      $.ajax({
        type: 'POST',
        url: stackTraceUrl,
        headers: {
          'Authorization': 'Bearer' + $cookies.get('_token')
        },
        data: angular.toJson({
          errorUrl: $window.location.href,
          errorMessage: errorMessage,
          stackTrace: stackTrace,
          cause: (cause || '')
        })
      })
    } catch (loggingError) {
      $log.warn('Error logging failed')
      $log.log(loggingError)
    }
  }

  return (log)
}


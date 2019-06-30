var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} //
// Animation method
// source: https://github.com/daneden/animate.css
//

$.fn.extend({
  animateCss: function animateCss(animationName, callback) {
    var animationEnd = function (el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd' };


      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    }(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  } });


//
// BranchNameGenerator module
//
//
var
BranchNameGenerator = function () {

  function BranchNameGenerator(element, options) {_classCallCheck(this, BranchNameGenerator);
    this.$element = element;
    this.options = $.extend(true, {}, BranchNameGenerator.defaults, this.$element.data(), options);

    this._init();
  }

  /**
     * Initialize the plugin
     * @private
     */_createClass(BranchNameGenerator, [{ key: '_init', value: function _init()
    {
      this.$inputs = this.$element.find('input, textarea, select');
      this.$outputArea = this.$element.find('[data-output-area]');
      this.$form = this.$element.find('[data-form]');
      this.willAnimate = true;

      this._bindEvents();
      this._renderOutputText();
    }

    /**
       * Initialize events for the plugin
       * @private
       */ }, { key: '_bindEvents', value: function _bindEvents()
    {var _this = this;

      if (this.options.validateOn === 'fieldChange') {
        this.$inputs.
        off('change').
        on('change', function (e) {
          _this._renderOutputText();

          if (_this.willAnimate) {
            var isValid = _this.checkFormValidity();

            if (isValid) {
              _this.applyFormCompletionAnimation();
              _this.willAnimate = false;
            }
          }
        });
      }

      if (this.options.liveValidate) {
        this.$inputs.
        off('input').
        on('input', function (e) {
          _this._renderOutputText();
        });
      }

      if (this.options.validateOnBlur) {
        this.$inputs.
        off('blur').
        on('blur', function (e) {
          _this._renderOutputText();
        });
      }

      this.$outputArea.
      on('click', function (e) {
        _this._copyToClipBoard();
        _this._renderCopySuccessMsg();
      });
    }

    /**
       * Process data from form
       * @private
       */ }, { key: '_processData', value: function _processData()
    {
      var data = JSON.parse(JSON.stringify(this.$form.serializeArray()));
      var dateToday = moment().format('MMDYYYY');

      var outputString = data.
      map(
      function (form) {
        if (form.name === 'description') {
          // Thanks to: https://stackoverflow.com/questions/42215005/get-rid-of-blank-strings-in-split
          var words = form.value.split(' ').filter(function (val) {return val;});

          return words.join('_') || 'xxx';
        } else if (form.name === 'ticket_type' && form.value === 'hotfix') {
          return form.value + '_' + dateToday;
        } else {
          return form.value || 'XXX';
        }
      }).

      join('_');

      return outputString;
    }

    /**
       * Render text in outputArea
       * @private
       */ }, { key: '_renderOutputText', value: function _renderOutputText()
    {
      var outputString = this._processData();
      this.$outputArea.
      text(outputString);
    }

    /**
       * Copy text to clipboard
       * @private
       */ }, { key: '_copyToClipBoard', value: function _copyToClipBoard()
    {
      var clipboard = new ClipboardJS('.output__wrapper', {
        target: function target(trigger) {
          return trigger;
        } });

    }

    /**
       * Render success message after copying text to clipboard
       * @private
       */ }, { key: '_renderCopySuccessMsg', value: function _renderCopySuccessMsg()
    {
      var $el = $('<p class="success-msg">Copied to clipboard!</p>');
      this.$outputArea.after($el);

      setTimeout(function () {
        $el.fadeOut('normal', function () {
          $(this).remove();
        });
      }, 1000);
    }

    /**
       * Render default text to output area
       * @private
       */ }, { key: '_renderDefaultOutputText', value: function _renderDefaultOutputText()
    {
      this.$outputArea.text(this.options.defaultOutputText);
    }

    /**
       * Trigger form animation
       * @function
       */ }, { key: 'applyFormCompletionAnimation', value: function applyFormCompletionAnimation()
    {
      var animation = this.options.animationName;

      this.$outputArea.animateCss(animation, function () {
        $(this).removeClass(animation);
      });
    }

    /**
       * Check if all form inputs are filled-in
       * @function
       * @returns {Boolean} isValid - true if no form inputs are empty
       * Thanks to: https://stackoverflow.com/questions/16211871/how-to-check-if-all-inputs-are-not-empty-with-jquery
       */ }, { key: 'checkFormValidity', value: function checkFormValidity()
    {
      var $form = this.$element;

      var isValid = $(':input', $form).filter(function () {
        return $.trim($(this).val()).length == 0;
      }).length == 0;

      return isValid;
    } }]);return BranchNameGenerator;}();


BranchNameGenerator.defaults = {
  validateOn: 'fieldChange',
  liveValidate: false,
  validateOnBlur: false,
  defaultOutputText: 'SJDEV_XXX_task_xxx',
  animationName: 'rubberBand fast' };


$('[data-branch-name-generator]').each(function () {
  new BranchNameGenerator($(this));
});

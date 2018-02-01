/*******************************************************************************
 * Aggregated Resource File 81cf30a8cba5facf9a822d3d62cd6f00f9669577.js
 *
 * include/modules/core/emailobfuscator/scripts/emailobfuscator.controller.js
 * include/modules/optional/js-mootools/scripts/mootools-pre.js
 * include/modules/core/util/scripts/common.js
 * include/modules/optional/js-util/scripts/eventtracking.controller.js
 * include/modules/optional/js-util/scripts/eventtracker.class.js
 * include/modules/optional/js-util/scripts/externallink.tracker.js
 * include/modules/custom/evaunt-site/scripts/site.controller.js
 *
 *******************************************************************************/


/* BEGIN include/modules/core/emailobfuscator/scripts/emailobfuscator.controller.js */

/**
 * @module    emailobfuscator
 * @authors    Kaj Haffenden, Abhi Beckert
 *
 * Replaces obfuscated email addresses in links and in general text.
 *
 * This JS is self-contained but will play nicely with Prototype.JS if it is installed.
 *
 * Tested in IE7, FF3, Chrome, Safari
 */
var EmailObfuscator = {

  /**
   * Configuration -- must match the equivalent PHP class.
   */
  requestPath:          "email/",
  atSignReplacement:    "[)][(]",     // Must be escaped for regex
  
  initialize: function() {
    if (window.addEventListener) { // modern browsers
      window.addEventListener('DOMContentLoaded', function() { EmailObfuscator.deObfuscate(); }, false);
      
    } else if (window.attachEvent) { // older versions of internet explorer
      document.write('<script type="text/javascript" defer="defer">EmailObfuscator.deObfuscate();</script>'); // this will execute before images are downloaded, but will sometimes run before all links are in the page and may miss some elements
      window.attachEvent('onload', function() { EmailObfuscator.deObfuscate(); }); // this will always run, but not until after all images are downloaded
    }
  },
  
  /**
   * Finds all <a> tags with mailto: links, and finds all other email addresses, and decodes them to display as normal.
   */
  deObfuscate: function() {
    
    var email_regex     = "([a-zA-Z0-9!#$%&'*+-\/=?^_`{|}~.]+)" + this.atSignReplacement + "([a-zA-Z0-9-.]+)";
    var patternHref     = new RegExp(".*" + this.requestPath + email_regex);        // the .* at the beginning is for HREFs that contain entire URL (e.g. IE)
    var patternUnlinked = new RegExp(this.requestPath + email_regex);
    
    // find and replace href="mailto:" links
    var tags = document.getElementsByTagName('a');
    var tagsLen = tags.length;
    for (var i=0; i<tagsLen; i++) {
      var href = tags[i].getAttribute('href');
      if (!href)
        continue;
      
      var email = href.replace(patternHref, '$1' + '@' + '$2');
      if (href != email)  // ensure a replacement was made
        tags[i].setAttribute('href', 'mailto:' + email);
    }
    
    // find <span> email addresses
    if (typeof($$) !== 'undefined')                // use Prototype.JS if it is available
      var tags = $$('span.obfuscated-email');
    else {
      this.registerIfNeeded_getElementsByClassName();     // ensure we have access to this function
      var tags = document.getElementsByClassName('obfuscated-email', 'span');
    }
    
    var tagsLen = tags.length;
    for (var i=0; i<tagsLen; i++) {
      tags[i].innerHTML = tags[i].innerHTML.replace(patternUnlinked, '$1' + '@' + '$2');
      
      if (tags[i].parentNode.tagName == 'A') {
        var href = tags[i].parentNode.getAttribute('href');
        if (href) {
          var email = href.replace(patternHref, '$1' + '@' + '$2');
          if (href != email)  // ensure a replacement was made
            tags[i].parentNode.setAttribute('href', 'mailto:' + email);
        }
      }
    }

  },
  
  /**
   * Checks if the getElementsByClassName function is available (it will be in FF, etc. but not IE7); if not, create it
   */
  registerIfNeeded_getElementsByClassName: function() {
    
    if (!document.getElementsByClassName) {                                     // check if the browser supports it natively
      document.getElementsByClassName = function(className, parentElement) {    // otherwise define it
        var pattern = new RegExp("\\b"+className+"\\b");
        var elementsWithClass = new Array();
        var tags = document.getElementsByTagName(parentElement);
        var tagsLen = tags.length;
        for (i=0, j=0; i<tagsLen; i++) {
          if (pattern.test(tags[i].className))
            elementsWithClass[j++] = tags[i];
        }
        return elementsWithClass;
      };
    }
  }
  
};

EmailObfuscator.initialize();


/* END /home/evaunt13/public_html/include/modules/core/emailobfuscator/scripts/emailobfuscator.controller.js */



/* BEGIN include/modules/optional/js-mootools/scripts/mootools-pre.js */


Array.implement({
	/**
	 * Concatenated additional array items to this array. Not
	 * to be confused with Array.concat(), which flattens array
	 * arguments one extra level before applying the items.
	 * 
	 * @param {arguments} [1..n] arrays whose items are to be
	 *                           concatenated to this array.
	 * @return {Array} the concatenated array.
	 */
	pconcat: function() {
		var newArray = this.clone();
		for(var i = 0; i < arguments.length; i++) {
			for(var j = 0; j < arguments[i].length; j++) {
				newArray.push(arguments[i][j]);
			}
		}
		return newArray;
	}
});

Function.implement({
	/**
	 * this is a modified version of the script described at 
	 * http://dhtmlkitchen.com/?category=/JavaScript/&date=2008/09/11/&entry=Function-prototype-bind
	 * 
	 * Please use this in place of Function.bind() or Function.pass() as
	 * this alleviates issues with partial argument application and
	 * unwanted array argument flattening.
	 * 
	 * @param {Object} context the 'this' value to be used.
	 * @param {arguments} [1..n] optional arguments that are
	 * prepended to returned function's call.
	 * @return {Function} a function that applies the original
	 * function with 'context' as the thisArg.
	 */
	pbind: function(context){
		var fn = this;
		var isPartial = arguments.length > 1;
	  
		var result = function() {};

		// Strategy 1: only one argument, so just bind, not a partialApply
		if(!isPartial) {
			result = function() {
				if(arguments.length !== 0) {
					return fn.apply(context, arguments);
				} else {
					return fn.call(context); // faster in Firefox.
				}
			};
		} else {
			// Strategy 2: partialApply
			var args = Array.prototype.slice.call(arguments, 1);

			result = function() {
				functionArgs = args.pconcat(arguments);
				return fn.apply(context, functionArgs);
			};
		}
		return result;
	}
});

var taipan = {
  console: {
    log: function(foo)
    {
      if (typeof('console') == 'undefined')
        return;
      
      console.log(foo);
    }
  }
};


/* END /home/evaunt13/public_html/include/modules/optional/js-mootools/scripts/mootools-pre.js */



/* BEGIN include/modules/core/util/scripts/common.js */

var taipan = {
  log: function(foo) {
    if (typeof(console) == 'undefined') {
      return;
    }
    
    console.log(foo);
  },
  localize: function(key, defaultValue) {
    if (typeof(LocalizationController) == 'undefined') {
      return defaultValue;
    }
    
    return LocalizationController.localize(key, defaultValue);
  } 
};

var loc = taipan.localize;


/* END /home/evaunt13/public_html/include/modules/core/util/scripts/common.js */



/* BEGIN include/modules/optional/js-util/scripts/eventtracking.controller.js */

/**
 * EventTrackingController
 * 
 * Uses Google Analytics to track events.
 * 
 * @author Daniel Holden
 */
var EventTrackingController = new Class({
  
  /**
   * Holds the current trackers that are configured
   */
  trackers: [],
  
  
  /**
   * Constructor. Initialize Event Tracking
   * 
   * @param trackers An optional array of tracker objects
   */
  initialize: function(trackers)
  {
    // only continue if the _gaq object has been set, usually defined by Google Analytics
    if(typeof(_gaq) == "undefined")
      return;
    
    // assign trackers, if we have any
    if(trackers !== undefined)
      this.trackers = trackers;
    
    // init trackers
    this._initializeTrackers();
  },
  
  
  /**
   * Rrefresh the trackers. This will initialize any new trackers that have been added
   */
  refresh: function()
  {
    this._initializeTrackers();
  },
  
  
  /**
   * Add a tracker to the array fo trackers
   * 
   * @param tracker The tracker object to add
   */
  addTracker: function(tracker)
  {
    this.trackers.push(tracker);
    this.refresh();
  },
  
  
  /**
   * Initialize trackers.
   */
  _initializeTrackers: function()
  {
    // if no trackers have been specified, return.
    if(this.trackers === undefined || this.trackers.length == 0)
      return;
    
    // setup an array to store initlized trackers - we dont want to init twice
    if(this._initTrackers === undefined)
      this._initTrackers = [];
    
    // loop through each tracker and apply the required functionality
    this.trackers.each(function(tracker)
    {
      if(!this._trackerIsInitialized(tracker))
      {
        if(tracker.trackEvents !== undefined)
          tracker.trackEvents();
        this._initTrackers.push(tracker);
      }
    }.pbind(this));
  },
  
  
  /**
   * Checks whether the passed in tracker has already been initialized
   * 
   * @param tracker The tracker object
   * @return bool
   */
  _trackerIsInitialized: function(tracker)
  {
    // if initialize hasn't been called, auto-return false
    if(this._initTrackers === undefined)
      return false;
    
    return this._initTrackers.contains(tracker);
  }
  
});

// create a new controller on dom ready
var eventTrackingController = false;
window.addEvent('domready', function()
{
  eventTrackingController = new EventTrackingController();
  window.fireEvent('taipanEventTracker');
});

/* END /home/evaunt13/public_html/include/modules/optional/js-util/scripts/eventtracking.controller.js */



/* BEGIN include/modules/optional/js-util/scripts/eventtracker.class.js */

/**
 * EventTracker Class
 * 
 * Provides functionality common to EventTrackers
 */
var EventTracker = new Class
({
  
  /**
   * Initialize the tracker and add it to the controller
   */
  initialize: function()
  {
    window.addEvent('taipanEventTracker', function()
    {
      // only continue if the _gaq object has been set, usually defined by Google Analytics
      if(typeof(_gaq) == "undefined")
        return;

      eventTrackingController.addTracker(this);
    }.pbind(this));
  },
  
  
   /**
   * Pushes the event onto the Google Analytics trackEvent queue with the relevant event data
   * 
   * @param object eventData
   */
  fireEventTracker: function(eventData)
  {
    // google analytics api for pushing an event to the event queue
    _gaq.push(['_trackEvent', eventData.category, eventData.action, eventData.opt_label, eventData.opt_value, eventData.opt_noninteraction]);
  },
  
  
  /**
   * TrackEvents, defines the functionality as to how to track the event
   * this function will be overriden by subclassed trackers
   * and will attach the fireEventTracker to its own event
   */
  trackEvents: undefined
});


/* END /home/evaunt13/public_html/include/modules/optional/js-util/scripts/eventtracker.class.js */



/* BEGIN include/modules/optional/js-util/scripts/externallink.tracker.js */

var ExternalLinkEventTracker = new Class
({
  Extends: EventTracker,
  
  trackEvents: function()
  {
    // get the base tag
    var baseHref = $('baseTag').href;
    
    // create a regular expression to match the href of page links
    var regex = new RegExp("^" + baseHref.escapeRegExp());
    
    // loop through all links on the page
    $$('a').each(function(el)
    {  
      // find all links that don't start with the base tag or http/https and ignore javascript
      if((!el.href.match(regex) || !el.href.match(/^https?:\/\//g)) && !el.href.match(/^javascript/g))
      {
        el.addEvent('click', function(clickEvent)
        {
          try
          {
            var target = null;
            
            // get the target of the outbound link if it exists or has an external rel defaulting to _blank
            if(el.getProperty('target') !== null || el.getProperty('rel') == 'external')
              target = el.getProperty('target') === null ? '_blank' : el.getProperty('target');
            
            // stop the event to prevent the external link going out
            // only if the target page is the current page (self) or has no target
            if(target === null || target == '_self')
              clickEvent.stop();
            
            // track the external click by firing the tracker event with the event data
            var eventData = {category:'Outbound Links', action: el.href};
            this.fireEventTracker(eventData);
            
            // now send the user to the href if the target is null or self
            if(target === null || target == '_self')
              setTimeout('document.location = "' + el.href + '"', 100);
            
          } catch(err) {}
          
        }.pbind(this));
      }
    }.pbind(this))
  }
});

new ExternalLinkEventTracker();

/* END /home/evaunt13/public_html/include/modules/optional/js-util/scripts/externallink.tracker.js */



/* BEGIN include/modules/custom/evaunt-site/scripts/site.controller.js */

var SiteController = new Class({
  Implements: [Options, Events],
  options: {
  },

  initialize: function(options){
    this.setOptions(options);
    this.hideMobileAddressBar();
  },

  hideMobileAddressBar: function() {
    if(typeof window.orientation === 'undefined') { //Kludgy mobile detect
      return;
    }

    if(typeof window.innerHeight == 'undefined') {
      return;
    }

    document.body.style.minHeight=(window.innerHeight+100)+'px';

    setTimeout(function() {
      window.scrollTo(0, 1);
    }, 100);
  }
});

document.addEvent('domready', function() {
  siteController = new SiteController();
});


/* END /home/evaunt13/public_html/include/modules/custom/evaunt-site/scripts/site.controller.js */


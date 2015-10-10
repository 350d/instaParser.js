/*!
 * instaParser.js v0.1.0
 * Small Javascript Library that parse an element containing a instagram photo description and turn URLS, @user & #hashtags into working urls
 * License : MIT
 * author Vincent Loy <vincent.loy1@gmail.com>
 * http://vincent-loy.fr
 * contributor Vladimir Sobolev <v.sobolev@gmail.com>
 * http://sobolev.us
 */

/*global window, document*/
/*jslint regexp: true*/

(function (exports) {
    'use strict';

    // Class
    var instaParser,

    // functions
        extend,
        generateLink;

    extend = function (out) {
        var i,
            key;

        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            if (arguments[i]) {
                for (key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }
        }
        return out;
    };

    generateLink = function (url, className, text) {
        var link = document.createElement('a');
        link.href = url;
        link.classList.add(className);
        link.textContent = text;

        return link;
    };

    instaParser = function (element, args) {
        var elt = document.querySelectorAll(element),
            parameters = extend({
                urlClass: 'link',
                userClass: 'user',
                hashtagClass: 'hashtag',
                target: '_blank',
                parseUsers: true,
                parseHashtags: true,
                parseUrls: true
            }, args);

        Array.prototype.forEach.call(elt, function (el) {

            var insta = el.innerHTML,
                searchlink = "https://instagram.com/explore/tags/", //search link for hashtags


            //regex
                regexUrl = /(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,\.])/g, //regex for urls
                regexUser = /\B@([a-zA-Z0-9_]+)/g, //regex for @users
                regexHashtag = /\B(#[á-úÁ-Úä-üÄ-Üa-zA-Z0-9_]+)/g; //regex for #hashtags

            //turn URLS in the instagram photo description into... working urls
            if (parameters.parseUrls) {
                insta = insta.replace(regexUrl, function (url) {
                    var link = generateLink(url, parameters.urlClass, url);

                    return url.replace(url, link.outerHTML);
                });
            }

            //turn @users in the instagram description into... working urls
            if (parameters.parseUsers) {
                insta = insta.replace(regexUser, function (user) {
                    var userOnly = user.slice(1),
                        url = 'https://instagram.com/' + userOnly,
                        link = generateLink(url, parameters.userClass, user);

                    return user.replace(user, link.outerHTML);
                });
            }

            //turn #hashtags in the instagram photo description into... working urls
            if (parameters.parseHashtags) {
                insta = insta.replace(regexHashtag, function (hashtag) {
                    var hashtagOnly = hashtag.slice(1),
                        url = searchlink + hashtagOnly,
                        link = generateLink(url, parameters.hashtagClass, hashtag);

                    return hashtag.replace(hashtag, link.outerHTML);
                });
            }

            //then, it inject the last var into the element containing the instagram photo description
            el.innerHTML = insta;
        });
    };

    exports.instaParser = instaParser;
}(window));

/*global $, jQuery, instaParser*/
if (window.jQuery) {
    (function ($, instaParser) {
        'use strict';

        function instaParserify(el, options) {
            instaParser(el, options);
        }

        $.fn.instaParser = function (options) {
            return instaParserify(this.selector, options);
        };
    }(jQuery, instaParser));
}

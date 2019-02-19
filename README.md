# Pinch-Zoom

#### Center-focused, two-touch pinch-zoom handler written in JavaScript for Firefox/Chrome

<p align="center"><img src="https://imgur.com/1El6RAX.gif" width=500></p>

See a live version of the page with pinch-zooming enabled [here](https://davidmwald.github.io/pinch-zoom/).

## Languages

- JavaScript
- HTML
- CSS

## Features

- Handles a two-touch pinch-zoom gesture for select content on web pages
- Magnified point-of-interest remains centered between two touch points when zooming in and, where possible, when zooming out
- Zooming in/out from 1-6x (customizable) magnification levels
- Compatible with Firefox and Chrome

## Installation / Customization

The code and example assets, as described and illustrated herein, can be acquired by forking/cloning this repository or from the latest release. Required and optional/customizable portions of the code (described below) can be combined with any desired page content, styles, and other scripts for developer use.

#### <ins>JavaScript (pinch-zoom.js)</ins>

The code provides necessary functionality to handle a two-touch pinch-zoom gesture on select content of a web page in Firefox or Chrome. To note, the zoomable content has been given the element id "zoomContent." Touch event handlers are registered to a separate child element with id "touchOverlay" which enables any target touches to be captured for a single DOM element rather than for separate DOM elements comprising the zoomable content. More details about these two major elements are described below. 

This specific pinch-zoom handler is designed such that a point-of-interest being zoomed upon remains centered, as often as possible, between the two touch points participating in the pinch-zoom gesture. When zooming in, the point-of-interest should always be centered. When zooming out, the point-of-interest will remain centered at higher magnification levels. An in-depth description of the codified steps needed to achieve this centering behavior is provided in the documentation [here](docs/NOTES.md).

At a minimum, pinch-zooming is generally only achieved if there are at least two active touch points on screen that originated on the target content. This pinch-zoom handler establishes optional criteria that may be removed or modified, as desired:

- Pinch-zooming can only occur with exactly two active touch points originating on the target element, not more
- If there are more than two active target touches and enough are removed to leave two remaining, pinch-zooming can then occur but only if the remaining two were the first two of the set
- Pinch-zooming cannot occur if there are any active touches that did not originate on the target element
- Pinch-zooming is only enabled if a touch interaction session begins with a target touch
- Pinch-zooming is disabled when all active target touches are removed and can only be re-enabled for a new touch interaction session

The lower and upper magnification limits and event-to-event magnification multiplier can be customized and are currently assigned values of 1x, 6x, and 1.02, respectively.

#### <ins>HTML (index.html)</ins>

A container div for the zoomable content (with id "container") is required. All zoomable content is placed in the div (with id "zoomContent") within the container div. The first child element within the "zoomContent" div must be an empty div (with id "touchOverlay").

#### <ins>CSS (styles.css)</ins>

Required and optional styles are commented in the code, primarily for the #container, #touchOverlay, and #zoomContent selectors. Notably, the content and overlay divs must be sized to 100% of the container div, which in turn should be sized to store all zoomable content without any overflow at 1x magnification.

## Usage

On a touch-enabled device, touch over the zoomable content at two locations and use a pinch gesture to magnify the point-of-interest located midway between the two touch points. Use an outward pinch gesture to zoom in or in inward pinch gesture to zoom out. Either one or both touch points can move during the gesture, and the magnified point-of-interest will remain centered between the two touch points, where possible. The two touch points must remain on screen but do not have to remain over the zoomable content. 

Pinch-zooming is only enabled if there are exactly two active touch points on screen that originated over the zoomable target content. Pinch-zooming will not work if there are three or more active target touches on screen. Pinch-zooming also will not work if there are any active touch points on screen that did not originate over the zoomable target content.

If one of the two touch points participating in a touch zoom is removed and then re-applied over the zoomable content, pinch-zooming can continue with a new centered point-of-interest. If there are more than two active target touch points and enough are removed to leave two remaining, pinch-zooming can still occur if the remaining two were the first two from that set. If not, pinch-zooming can occur by removing and re-applying one of the two target touches or by starting an entire new touch interaction session. 

During a touch interaction session, pinch-zooming is only enabled if the first overall touch is over the zoomable content. Pinch-zooming is also disabled until a new touch interaction session begins whenever all active target touches are removed.

## Potential Future Work

- Compatibility for other browsers

## Version History

#### v1.0.0 -- February 18, 2019

- Initial release
- Compatible with Firefox and Chrome

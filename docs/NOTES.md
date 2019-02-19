# Notes for Center-Point Pinch-Zooming

1. Goal is to use a two-point pinch-zoom gesture to zoom in/out on a zoomable element at a specific point-of-interest (POI) -- the POI acts as a custom scaling base point

2. We want the POI to, as often as possible, remain aligned at all magnification levels with the current center of gesture -- to accomplish, we will relate the current center of gesture to the original center of gesture and use overflow scrolling for alignment

   * For pinch zooming, the center of gesture is midway between the two touches

3. Because we will not also be shifting the location of the zoomable element, overflow scrolling alone cannot guarantee alignment when zooming out!!!

   * Center alignment when zooming out will only be possible at higher magnification levels

4. We need a container div acting as a viewport that houses the zoomable content and clips any overflow to enable scrolling -- with or without scrollbars

5. We need a zoomable element, sized to 100% of the container div and with a CSS transformation base point from the top-left to ensure that all overflow is to the right and bottom of the container and can thus be accessed via scrolling

6. Magnification will be achieved by pinch-zooming, where the distance between two touch points changes during a `touchmove` event

7. To convert the top-left CSS scaling base point of the zoomable element into a custom scaling base point at the POI, we first need to know the position of the POI with respect to the top-left edge of the element (i.e., the content POI offset position)

   * In general, we can relate the content POI offset position (C) to the POI page position (P) by utilizing the zoomable element's page offset position (O) and the container's scroll position (S) as follows:

   <p align="center">C = P - O + S</p>

8. At the start of the pinch-zoom gesture:

   <p align="center">C1 = P1 - O1 + S1</p>

9. During the gesture:

   <p align="center">C2 = P2 - O2 + S2</p>

10. Considering magnification levels (M), the zoom factor (relative magnification level) between the current state of the gesture and start of the gesture is:

    <p align="center">ZF = M2 / M1</p>

11. The content POI offset position during the gesture compared to the start of the gesture is related by the zoom factor:

    <p align="center">C2 = ZF * C1</p>

12. The POI page position at the start of the gesture is the midway point between the two touches during the second's `touchstart` event (found with the Touch objects' `pageX` and `pageY` properties)

13. The POI page position during the gesture is the midway point between the two touches during a `touchmove` event (found with the Touch objects' `pageX` and `pageY` properties)

14. The zoomable element's page offset position can be found with the `offsetLeft` and `offsetTop` properties and will be constant during magnification:

    <p align="center">O1 = O2 = O</p>

15. The scroll positions of the container at the start of the gesture can be found with the `scrollLeft` and `scrollTop` properties

16. Combining all equations, we can solve for the unknown container scroll positions during the gesture to achieve centering:

<p align="center">C2 = ZF * C1</p>

<p align="center">C2 = ZF * (P1 - O + S1)</p>

<p align="center">P2 - O + S2 = ZF * (P1 - O + S1)</p>

<p align="center">S2 = ZF * (P1 - O + S1) - P2 + O</p>


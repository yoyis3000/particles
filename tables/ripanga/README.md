# Ripanga

A table component with self-managed checkboxes, sticky head, sticky right panel, and horizontal scroll widget.

# Change Log

##### 2.0.0
- Throttle slider actions to improve performance
- Move checkbox persistence to session storage to avoid local storage overflow bugs
- Expand all / collapse all groups now managed internally
- Remove shouldcomponentupdate for row to fix line repainting issues
- Remove lodash to lighten component footprint
- Remove immutable to lighten component footprint
- Fixed Cannot read property 'getBoundingClientRect' of undefined console error
- requestAnimationFrame used to optimize DOM changes
- Stylesheet composition implemented
- Overflow bug on inline edit dropdown
- Improved documentation (sandbox examples)

##### 1.0.8, 1.0.9
- Implemented prod builds

##### 1.0.7
- `renderEmpty()` method added for empty state

##### 1.0.6
- Implemented Webpack 2.2.1

##### 1.0.5
- Minor Webpack optimizations

##### 1.0.4
- _Experimental; no significant changes_

##### 1.0.3
- Return to page 1 on sort

##### 1.0.2
- Caret styles consolidated
- Removed `ripanga-` prefix on styles

##### 1.0.1
- Debugging URL construction

##### 1.0.0
- Initial commit

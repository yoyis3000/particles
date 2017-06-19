# Ripanga

A table component with self-managed checkboxes, sticky head, sticky right panel, and horizontal scroll widget.

# Change Log

##### 2.2.7
- Don't show sidebar cells when groups are collapsed

##### 2.2.6
- Fix bug that was causing the header to lose stickiness on update

##### 2.2.5
- Added in safe checks to avoid null references

##### 2.2.4
- Fix resize bug that cause sidebar head to lose stickiness

##### 2.2.3
- Updating package.json to Particles URL

##### 2.2.2
- Fixed overflow issue (child elements of the table can now overflow the table)

##### 2.2.1
- Fixed sticky header scroll bug
- Changed some border styling to fix overflow cell border rendering bugs

##### 2.2.0
- Added in support for more table listeners, ability to figure out the internal state of checkedIds

##### 2.1.2
- Adjusted naming convention for ongroupselect from `key` to `name`

##### 2.1.1
- Patch groupBy

##### 2.1.0
- Adding more exposed subscribable methods for table management
-- checkAll, checkOne, resize, scroll standardized and namespaced to 'table'

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
- Package size decreased from 925kb to 135kb (pre-compression)
- Removed URL updating

#### 1.2.3
- Added back missing variables and passing down of globalKey correctly

##### 1.2.2
- Removing reset.scss

##### 1.2.1
- Configure sorting features through props
```
<Table
  sorting: {
    direction: (columnDefinition) => 'desc' | 'asc' | false,
    change: (columDefinition) => return void
  }
/>
```

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

# Tatari

A dynamically populated filter component.

# Change Log

##### 2.3.0
- When only one item is selected, it is displayed in the dropdown title token for better visibility

##### 2.2.6
- Added internationalization for placeholders
- The CSS file was alphabetized, and unnecessary overrides were removed
- Many micro style tweaks were made
- The dropdown body is now responsive with a min- and max-width
- The sandbox file has "more realistic" data now
- The typeahead search bar in the dropdown body now has a placeholder value
- Deleted unnecessary CSS files

##### 2.2.5
- Added backwards compatibility for saved filters that come back as arrays rather than objects

##### 2.2.4
- Removing reset.scss

##### 2.2.2, 2.2.3
- Small style fixes

##### 2.2.1
- Autofocus

##### 2.2.0
- Adding `filterOptions` function

##### 2.1.12
- Restored search functionality after clear.

##### 2.1.11
- Added graceful handling if no PATCH endpoint provided

##### 2.1.10
- If empty, DELETE not PATCH.

##### 2.1.9
- Persisting text search even if no results

##### 2.1.7, 2.1.8
- Text wrapping update
- Removing default hover and rotate on arrow

##### 2.1.6
- Fixed border handling
- Fixed truncation for long filter names
- Added padding so count doesn't bump against caret

##### 2.1.4, 2.1.5
- Fixing wrapping
- Changing filter width to responsive, not fixed

##### 2.1.3
- Removing sans-serif default on star selector

##### 2.1.2
- Fixed select all to respect search

##### 2.1.1
- Fixed restoring checkboxes regardless of data type

##### 2.1.0
- Fixed focus/click on inline search
- Styling updates
- Resetting "hidden" state during population
- Improved empty state handling

##### 2.0.1 - 2.0.5
- Adding Lerna publishing management
- Splitting out dev dependencies

##### 2.0.0
- Removed Immutable and Redux deps, now 90% smaller (770kb -> 66kb)
- Various styling upgrades for default component parity

##### 1.1.7
- Implemented prod builds

##### 1.1.6
- Removing unnecessary dependencies

##### 1.1.5
- Implemented Webpack 2.2.1

##### 1.1.4
- ENV variable support added

##### 1.1.3
- Ball In Court filter added

##### 1.1.2
- _Experimental; no significant changes_

##### 1.1.1
- Moving I18N from view to reducer

##### 1.1.0
- Callback functionality for use after initialization

##### 1.0.4
- Linting

##### 1.0.3
- Return to page 1 after filter update

##### 1.0.2
- Minor padding update

##### 1.0.1
- Centering checkboxes on multiline items
- Removing available filters if all added
- Updated count after selecting all

##### 1.0.0
- Initial commit

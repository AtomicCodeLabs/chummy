# Adding a new theme

Copy any file in `src/themes` and replace the colors with your own.

## Adding a new theme variable

1. Add the desired key value pair to all the json files in `src/themes`.
2. Export a specific camel-cased theme variable in `src/constants/theme.js` with the correct selector. This exposes a styled-theming function that can be used in any styled-components string literal.
3. Use it somewhere in the code!

const DATA_TEST_ID_REGEX = new RegExp('^data-testid$');

/**
 * babel plugin that removes all attributes that match the predefined regex. (in our case all data-testid="....")
 *
 * inspired by https://github.com/wireapp/babel-plugin-remove-jsx-attributes
 *
 * This plugin is activated via "env" > "production" > "plugins" in our client/.babelrc file
 */
module.exports = function ({types: t}) {
  return {
    visitor: {
      JSXElement({node}) {
        node.openingElement.attributes = filterAttributes(node.openingElement.attributes);
      }
    }
  };
};

function filterAttributes(attrs) {
  return attrs.filter((attributeEntry) =>
    attributeEntry.name ? !DATA_TEST_ID_REGEX.test(attributeEntry.name.name) : true
  );
}

/**
 * babel plugin that removes all attributes that match the predefined regex. (in our case all data-testid="....")
 * "data-testid" attributes are used in our cypress e2e tests to identify elements.
 *
 * inspired by https://github.com/wireapp/babel-plugin-remove-jsx-attributes
 *
 * This plugin is activated via "env" > "production" > "plugins" in our client/.babelrc file
 */

const DATA_TEST_ID_REGEX = new RegExp('^data-testid$');

export default function removeDataTestIdAttributes({types: t}) {
  return {
    visitor: {
      JSXElement({node}) {
        node.openingElement.attributes = filterAttributes(node.openingElement.attributes);
      }
    }
  };
}

const filterAttributes = (attrs) =>
  attrs.filter((attributeEntry) =>
    attributeEntry.name ? !DATA_TEST_ID_REGEX.test(attributeEntry.name.name) : true
  );

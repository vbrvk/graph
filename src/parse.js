const getNodeInfo = (str, delimitre) => {
  const res = {
    deep: 0,
  };
  let value = str;
  while (value[0] === delimitre) {
    res.deep += 1;
    value = value.slice(1);
  }
  res.value = value;
  return res;
};

const parse = (str, delimitre) => {
  if (str[0] === delimitre) throw new Error('There is no root element');
  const nodes = str.split('\n');

  const tree = [];
  let id = 1;

  // define root element
  const rootElement = getNodeInfo(nodes[0], delimitre);
  rootElement.parent = null;
  rootElement.id = 0;
  tree.push(rootElement);
  nodes.shift();

  const prevElement = {
    0: 0, // Id of root element
  };

  let prevDeep = 0; // Deep of root element
  while (nodes.length) {
    const curenNode = getNodeInfo(nodes[0], delimitre);
    if (curenNode.deep > prevDeep + 1) throw new Error('Syntax error');

    curenNode.id = id;
    curenNode.parent = prevElement[curenNode.deep - 1];
    tree.push(curenNode);

    prevDeep = curenNode.deep;
    prevElement[curenNode.deep] = curenNode.id;
    id += 1;

    nodes.shift();
  }

  return tree;
};

export default parse;
